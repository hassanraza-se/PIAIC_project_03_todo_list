#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

const log = console.log;
const red = chalk.red;
const green = chalk.green;
const greenBold = chalk.green.bold;
enum TaskStatus {
    Pending = "Pending",
    "In-Progress" = "In-Progress",
    Complete = "Complete"
}

/**
 * Class implementation for Task
 */
class Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    created_at: string;

    constructor(title: string, description: string, status: TaskStatus) {
        this.id = (tasks[tasks.length - 1] ? tasks[tasks.length - 1].id + 1 : 0);
        this.title = title;
        this.description = description;
        this.status = status;
        this.created_at = (new Date).toISOString();
    }
}

const tasks: Task[] = [];

/**
 * Function to create a new task
 */
async function addTask(): Promise<Task> {
    const {title} = await inquirer.prompt({
        name: "title",
        type: "input",
        message: "Enter Task Title:",
        default: `Task ${tasks[tasks.length - 1] ? tasks[tasks.length - 1].id + 1 : 0}`
    });
    const {description} = await inquirer.prompt({
        name: "description",
        type: "input",
        message: "Enter Task Description:",
        default: `${title} description`
    });
    const {status} = await inquirer.prompt({
        name: "status",
        type: "list",
        choices: [
            { name: 'Pending', value: TaskStatus.Pending },
            { name: 'In-Progress', value: TaskStatus["In-Progress"] },
            { name: 'Complete', value: TaskStatus.Complete },
        ],
        message: "Choose Task Status:",
        default: "Pending"
    });

    const task = new Task(title, description, status);
    tasks.push(task);

    return task;
}

/**
 * Function to update task
 * @param taskId
 */
function updateTaskStatus(taskId: number) {
    const taskIndex = tasks.findIndex((task) => task.id == taskId );
    if (taskIndex >= 0) {
        const task = tasks[taskIndex];
        inquirer.prompt({
            name: "status",
            type: "list",
            choices: [
                { name: 'Pending', value: TaskStatus.Pending },
                { name: 'In-Progress', value: TaskStatus["In-Progress"] },
                { name: 'Complete', value: TaskStatus.Complete },
            ],
            message: `Choose Task Status: (Current status is: ${task.status})`,
        }).then(({status}) => {
            tasks[taskIndex].status = status;
            log(greenBold(`Task: "${task.title}" status updated.`));
            chooseMenu();
        });
    } else {
        log(red("No task was found to update."));
        chooseMenu();
    }
}

/**
 * Function to delete a task
 * @param taskId
 */
function deleteTask(taskId: number) {
    const taskIndex = tasks.findIndex((task) => task.id == taskId );
    const task = tasks[taskIndex];
    inquirer.prompt({
        name: 'isDelete',
        type: "confirm",
        message: `Are you sure to delete task: ${task.title}`
    }).then(({isDelete}) => {
        if (isDelete) {
            tasks.splice(taskIndex, 1);
            log(greenBold(`Task: "${task.title}" deleted.`));
        }
        chooseMenu();
    })
}

function chooseMenu() {
    inquirer.prompt({
        name: "option",
        type: "list",
        message: "Choose an option to continue:",
        choices: ["Main Menu", "Exit"]
    }).then(({option}) => {
        if (option === "Main Menu") {
            initApp();
        } else {
            log(greenBold("Thank you for using the app."));
        }
    })
}

function initApp() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Choose an action to proceed:",
        choices: ["View Tasks", "Add Task", "Update Task Status", "Delete a Task"]
    }).then(({action}) => {
        switch (action) {
            case "View Tasks":
                if (tasks.length > 0) {
                    log(greenBold("Your Tasks are:"), tasks);
                } else {
                    log(red("You don't have any task"));
                }
                chooseMenu();
                break;
            case "Add Task":
                addTask().then(task => {
                    log(green("A new task is created"), task);
                    chooseMenu();
                });
                break;
            case"Update Task Status":
                inquirer.prompt({
                    name: "task",
                    type: "list",
                    message: "Choose Task To Update Status:",
                    choices: tasks.map(task => {
                        return { name: task.title, value: task.id }
                    })
                }).then(({task}) => {
                    updateTaskStatus(task);
                })
                break;
            case "Delete a Task":
                inquirer.prompt({
                    name: "task",
                    type: "list",
                    message: "Choose Task To Delete:",
                    choices: tasks.map(task => {
                        return { name: task.title, value: task.id }
                    })
                }).then(({task}) => {
                    deleteTask(task);
                })
                break;
        }
    })
}

initApp();