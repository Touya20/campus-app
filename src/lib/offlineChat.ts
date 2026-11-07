import { api } from '../components/features/api';
import { date, field, rows, text, time } from './api';

type Row = Record<string, unknown>;
const read = (value: unknown, ...keys: string[]) => text(field(value, ...keys));
const includesAny = (value: string, words: string[]) => words.some((word) => value.includes(word));
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const preparedLessons: Array<{ keys: string[]; reply: string }> = [
  { keys: ['array', 'insertion', 'deletion', 'traversal'], reply: 'An array stores items in indexed order. Reading an item by index is usually O(1). Inserting or deleting near the beginning or middle usually takes O(n), because later items must shift. Example: inserting at index 2 means moving each later item one position.' },
  { keys: ['big o', 'time complexity', 'space complexity', 'o(n)', 'o(1)', 'o(log n)'], reply: 'Big O describes how an algorithm’s work or memory grows as the input gets larger. O(1) stays roughly constant, O(log n) grows slowly by reducing the search space, and O(n) grows in proportion to the number of items. It compares growth, not exact seconds.' },
  { keys: ['binary search'], reply: 'Binary search finds a target in a sorted list by checking the middle item, then discarding the half that cannot contain the target. It repeats until the item is found or the range is empty. Its time complexity is O(log n), and the input must be sorted.' },
  { keys: ['linear search', 'sequential search'], reply: 'Linear search checks items one at a time until it finds the target or reaches the end. It works on sorted and unsorted data and takes O(n) time in the worst case.' },
  { keys: ['sorting', 'bubble sort', 'insertion sort'], reply: 'Sorting arranges values into an order, such as smallest to largest. Bubble sort repeatedly swaps adjacent out-of-order values; insertion sort places each next value into the correct position in the sorted portion. Both are easy to learn, but commonly take O(n²) time on large inputs.' },
  { keys: ['usability', 'heuristic', 'hci', 'user interface'], reply: 'Usability is how easily people can learn and use an interface to reach their goals. Useful checks include clear feedback after actions, consistent labels, preventing common errors, making choices visible, and keeping the main task straightforward.' },
  { keys: ['cia triad', 'confidentiality', 'integrity', 'availability', 'information security'], reply: 'The CIA triad is a basic information-security model: confidentiality means only authorized people can see data; integrity means data stays accurate and is changed only appropriately; availability means authorized users can access systems when they need them.' },
  { keys: ['photosynthesis'], reply: 'Photosynthesis is how plants, algae, and some bacteria use light energy to make sugars from carbon dioxide and water. Oxygen is released as a by-product. A simplified equation is: carbon dioxide + water + light → glucose + oxygen.' },
  { keys: ['algorithm'], reply: 'An algorithm is a finite, ordered set of steps for solving a problem. A good algorithm has clear inputs and outputs, unambiguous instructions, and eventually finishes. For example, a search algorithm describes how to find a target in a collection.' },
  { keys: ['database normalization', 'normalization'], reply: 'Database normalization organizes related data into tables to reduce unnecessary repetition and prevent update, insert, and delete anomalies. In practice, identify entities, give each a key, and connect related records with foreign keys.' },
  { keys: ['api', 'application programming interface'], reply: 'An API is a defined way for software to request data or actions from another system. A REST API commonly uses HTTP methods such as GET to read, POST to create, PATCH to update, and DELETE to remove resources.' },
  { keys: ['loop', 'for loop', 'while loop', 'iteration'], reply: 'A loop repeats a block of code. A for loop is useful when you know the iteration pattern or range; a while loop repeats while a condition remains true. Make sure the condition eventually changes so the loop can stop.' },
];

async function answerPortalQuestion(question: string): Promise<string | null> {
  if (includesAny(question, ['course', 'enrolled', 'subject', 'class list', 'classes do i have'])) {
    const courses = rows(await api.courses());
    if (!courses.length) return 'I could not find course information right now.';
    return `Your courses:\n${courses.map((course) => `• ${read(course, 'courseCode', 'course_code')} — ${read(course, 'courseName', 'course_name', 'name')}`).join('\n')}`;
  }

  if (includesAny(question, ['assignment', 'homework', 'deadline', 'due date', 'what is due', 'what’s due', 'upcoming work'])) {
    const assignments = rows(await api.upcomingAssignments());
    if (!assignments.length) return 'You have no upcoming unsubmitted assignments in the current preview.';
    return `Upcoming assignments:\n${assignments.slice(0, 8).map((item) => {
      const title = read(item, 'title', 'assignmentTitle', 'assignment_title') || 'Assignment';
      const course = read(item, 'courseCode', 'course_code', 'courseName', 'course_name');
      const due = date(field(item, 'dueAt', 'due_at'));
      return `• ${title}${course ? ` (${course})` : ''} — due ${due}`;
    }).join('\n')}`;
  }

  if (includesAny(question, ['schedule', 'class time', 'my classes', 'next class', 'lecture time', 'when do i have class'])) {
    const sessions = rows(await api.schedule());
    if (!sessions.length) return 'I could not find any class sessions in the current weekly schedule.';
    return `Your weekly class schedule:\n${sessions.slice(0, 12).map((session) => {
      const dayValue = Number(field(session, 'dayOfWeek', 'day_of_week'));
      const day = Number.isInteger(dayValue) && dayValue >= 0 && dayValue < 7 ? days[dayValue] : read(session, 'dayName', 'day_name', 'dayOfWeek');
      const start = time(field(session, 'startTime', 'start_time'));
      const end = time(field(session, 'endTime', 'end_time'));
      const course = read(session, 'courseCode', 'course_code', 'courseName', 'course_name') || 'Class';
      const room = read(session, 'room', 'location');
      return `• ${day}: ${start}${end ? `–${end}` : ''} — ${course}${room ? ` (${room})` : ''}`;
    }).join('\n')}`;
  }

  if (includesAny(question, ['grade', 'grades', 'score', 'scores', 'mark', 'marks', 'result'])) {
    const grades = rows(await api.grades());
    if (!grades.length) return 'There are no released grades to show right now.';
    return `Your released grades:\n${grades.slice(0, 10).map((grade) => {
      const title = read(grade, 'assignmentTitle', 'assignment_title', 'title') || 'Assessment';
      const course = read(grade, 'courseName', 'course_name', 'courseCode', 'course_code');
      return `• ${title}${course ? ` (${course})` : ''}: ${read(grade, 'score') || '—'} / ${read(grade, 'maxScore', 'max_score') || '—'}`;
    }).join('\n')}`;
  }

  if (includesAny(question, ['announcement', 'announcements', 'campus news', 'campus update', 'notice'])) {
    const announcements = rows(await api.announcements());
    if (!announcements.length) return 'There are no announcements to show right now.';
    return `Recent announcements:\n${announcements.slice(0, 6).map((item) => `• ${read(item, 'title') || 'Campus update'} — ${date(field(item, 'createdAt', 'created_at'))}`).join('\n')}`;
  }

  if (includesAny(question, ['my name', 'my profile', 'my account', 'who am i'])) {
    const profile = await api.profile();
    const name = read(profile, 'fullName', 'full_name', 'name');
    const program = read(profile, 'program');
    const year = read(profile, 'yearLevel', 'year_level');
    if (!name && !program && !year) return 'I could not load your student profile right now.';
    return `Your profile shows${name ? ` ${name}` : ''}${program ? `, ${program}` : ''}${year ? `, year ${year}` : ''}.`;
  }

  return null;
}

async function answerCourseLesson(question: string): Promise<string | null> {
  const courses = rows(await api.courses());
  const lessonRows: Array<{ module: Row; courseName: string }> = [];
  for (const course of courses.slice(0, 10)) {
    const courseId = read(course, 'id', 'courseId', 'course_id');
    if (!courseId) continue;
    const modules = rows(await api.modules(courseId));
    const courseName = read(course, 'courseName', 'course_name', 'courseCode', 'course_code') || 'your course';
    modules.forEach((module) => lessonRows.push({ module, courseName }));
  }
  const match = lessonRows.find(({ module }) => {
    const title = read(module, 'title', 'name').toLowerCase();
    return title.length > 2 && question.includes(title);
  });
  if (match) {
    const title = read(match.module, 'title', 'name');
    const description = read(match.module, 'description');
    return `${title} in ${match.courseName}${description ? `:\n${description}` : ' is listed in your course modules.'}`;
  }
  if (includesAny(question, ['lesson', 'module', 'topic', 'explain', 'teach me', 'what is', 'what are'])) {
    const available = lessonRows.map(({ module, courseName }) => `• ${read(module, 'title', 'name')} (${courseName})`);
    if (available.length) return `I can show these lesson topics from your courses:\n${available.slice(0, 12).join('\n')}\n\nFor prepared explanations, try arrays, Big O, binary search, usability, the CIA triad, algorithms, or database normalization.`;
  }
  return null;
}

export async function answerOfflineQuestion(input: string): Promise<string> {
  const question = input.trim().toLowerCase().replace(/\s+/g, ' ');
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(question)) {
    return 'Hi! I’m Campus Helper. I work offline using prepared answers and your Campus portal data. What would you like help with?';
  }
  if (includesAny(question, ['study plan', 'study schedule', 'how should i study', 'study tips'])) {
    return 'Try this study plan:\n1. Pick one lesson and set a 25-minute focus block.\n2. Write down what you already know, then review the lesson.\n3. Close your notes and explain the idea from memory.\n4. Do a practice question and check your answer.\n5. Note one question to ask your instructor.';
  }
  const portalAnswer = await answerPortalQuestion(question);
  if (portalAnswer) return portalAnswer;

  const lesson = preparedLessons.find(({ keys }) => includesAny(question, keys));
  if (lesson) return lesson.reply;

  const lessonAnswer = await answerCourseLesson(question);
  if (lessonAnswer) return lessonAnswer;

  if (/^(help|what can i do|what can you do|options|help me)\??$/.test(question)) {
    return 'I can answer questions about your courses, upcoming assignments, weekly schedule, released grades, announcements, and student profile. I also have prepared explanations for arrays, Big O, search and sorting, usability, information security, algorithms, databases, APIs, loops, and photosynthesis.';
  }

  return 'I’m an offline, rule-based helper, so I can’t generate an explanation for every new topic. I can look up your Campus courses, assignments, schedule, released grades, and announcements, or explain prepared topics like arrays, Big O, binary search, usability, and the CIA triad. Type “help” to see examples.';
}
