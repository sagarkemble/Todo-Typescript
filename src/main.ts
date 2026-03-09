import { createIcons, icons } from "lucide";
import { gsap } from "gsap";
import { registerSW } from "virtual:pwa-register";

//#region //*========== declaration ==========*//
registerSW({ immediate: true });
interface TaskObjValueInterface {
  id: IdType;
  taskText: string;
  status: boolean;
  createdAt: number;
}
interface TaskObjInterface {
  [key: string]: TaskObjValueInterface;
}
type IdType = string;
const taskForm = document.getElementById("task-form") as HTMLFormElement;
const taskInput = document.getElementById("task-input") as HTMLInputElement;
const taskList = document.querySelector(".task-list") as HTMLElement;
const greeting = document.getElementById("gretting") as HTMLElement;
const tagLine = document.getElementById("tag-line") as HTMLElement;
const headingWrapper = document.querySelector(
  ".heading-wrapper",
) as HTMLElement;
let taskObj: TaskObjInterface = {};
const greetingsArr: string[] = [
  "Hello",
  "Hi",
  "Hey",
  "Vanakkam",
  "Sat Sri Akal",
  "Kem Cho",
  "Hola",
  "नमस्ते",
  "नमस्कार",
  "प्रणाम",
  "Bonjour",
  "Ciao",
  "Olá",
  "Konnichiwa",
  "Annyeong",
  "Nǐ hǎo",
  "Hej",
  "Ahoj",
  "Sawasdee",
  "Kamusta",
];
const taglinesArr: string[] = [
  "One task at a time",
  "Let’s get things done",
  "Start small, finish big",
  "Focus on what matters",
  "Plan. Do. Done.",
  "Make today productive",
  "Clear tasks, clear mind",
  "Turn plans into progress",
  "One step closer today",
  "Stay focused. Stay sharp",
  "Progress starts here",
  "Small wins every day",
  "Organize your day",
  "Let’s finish something today",
  "Your tasks, your pace",
  "Today is a good day to finish things",
  "Little progress matters",
  "Make progress, not excuses",
  "One checkmark closer",
  "Keep moving forward",
];
let grettingIndex = 0;
let tagLineIndex = 0;
//#endregion //*========== declaration ==========*//

//#region //*========== start flow or DOM loaded listner logic ==========*//
document.addEventListener("DOMContentLoaded", async () => {
  if (getLocalStorageData()) loadTasks();
  shuffleArray(greetingsArr);
  shuffleArray(taglinesArr);
  await setGreetingAndTagline();
  createIcons({ icons });
  fadeIn(document.body, 0.5);
});
//#endregion //*========== start flow or DOM loaded listner logic ==========*//

//#region //*========== local storage to tasklist logic ==========*//
function getLocalStorageData(): boolean {
  const localStorageData = localStorage.getItem("taskList");
  if (localStorageData) {
    taskObj = JSON.parse(localStorageData);
    return true;
  }
  return false;
}
function loadTasks() {
  for (const key in taskObj) {
    createTaskElement(key);
  }
}
//#endregion //*========== local storage logic ==========*//

//#region //*========== submit task logic ==========*//
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("clicked");

  const taskText = taskInput.value.trim();

  if (!taskText) return;
  const createdAt = Date.now();
  const id: IdType = createdAt.toString();
  taskObj[id] = {
    id,
    taskText,
    status: false,
    createdAt,
  };
  localStorage.setItem("taskList", JSON.stringify(taskObj));
  createTaskElement(id);
  createIcons({ icons });

  taskInput.value = "";
});
//#endregion //*========== submit task logic ==========*//

//#region //*========== create task element ==========*//
function createTaskElement(id: IdType) {
  const individualTaskObj = taskObj![id];

  const task = document.createElement("div");
  task.className = "task";
  task.id = id;

  const checkBox = document.createElement("input");
  checkBox.classList = "checkbox";
  checkBox.type = "checkbox";

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("task-remove");
  closeBtn.innerHTML = `<i data-lucide="x" width="16" height="16"></i>`;

  const taskText = document.createElement("span");
  taskText.classList.add("task-text");
  taskText.innerText = individualTaskObj.taskText;

  if (individualTaskObj.status) {
    checkBox.checked = true;
    taskText.classList.add("completed");
  } else {
    checkBox.checked = false;
    taskText.classList.remove("completed");
  }

  task.appendChild(checkBox);
  task.appendChild(taskText);
  task.appendChild(closeBtn);

  closeBtn.addEventListener("click", () => {
    task.remove();
    delete taskObj![id];
    localStorage.setItem("taskList", JSON.stringify(taskObj));
  });

  checkBox.addEventListener("change", () => {
    if (checkBox.checked) {
      taskObj![id].status = true;
      taskText.classList.add("completed");
    } else {
      taskObj![id].status = false;
      taskText.classList.remove("completed");
    }

    localStorage.setItem("taskList", JSON.stringify(taskObj));
  });

  task.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (
      e.target === checkBox ||
      target === closeBtn ||
      target.tagName === "svg"
    )
      return;

    checkBox.checked = !checkBox.checked;
    checkBox.dispatchEvent(new Event("change"));
  });
  taskList.prepend(task);
}
//#endregion //*========== create task ==========*//

//#region //*========== heading wrapper logic ==========*//
function shuffleArray(arr: string[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
async function setGreetingAndTagline() {
  await fadeOut(headingWrapper);
  greeting.innerText = `${greetingsArr[grettingIndex]}`;
  tagLine.innerText = taglinesArr[tagLineIndex];
  grettingIndex = (grettingIndex + 1) % greetingsArr.length;
  tagLineIndex = (tagLineIndex + 1) % taglinesArr.length;
  await fadeIn(headingWrapper);
}
headingWrapper.addEventListener("click", setGreetingAndTagline);
//#endregion //*========== heading wrapper logic ==========*//

//#region //*========== animation functions ==========*//

function fadeOut(element: HTMLElement, time = 0.2) {
  return new Promise((resolve) => {
    gsap.to(element, {
      opacity: 0,
      animation: "easeInOut",
      duration: time,
      onComplete: resolve,
    });
  });
}

function fadeIn(element: HTMLElement, time = 0.2) {
  return new Promise((resolve) => {
    gsap.to(element, {
      opacity: 1,
      animation: "easeInOut",
      duration: time,
      onComplete: resolve,
    });
  });
}

//#endregion //*========== animation functions ==========*//
