import mockData from '../data/mockData.json';

function wait(ms = 300) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fetchAll() {
  await wait(300);
  return JSON.parse(JSON.stringify(mockData));
}

export async function saveTask(newTask) {
  await wait(150);
  return { ...newTask };
}
