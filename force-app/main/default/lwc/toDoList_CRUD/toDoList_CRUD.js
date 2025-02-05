import { LightningElement, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/ToDoController.getTasks';
import addTask from '@salesforce/apex/ToDoController.addTask';
import deleteTask from '@salesforce/apex/ToDoController.deleteTask';
import updateTask from '@salesforce/apex/ToDoController.updateTask';
import getTaskToUpdate from '@salesforce/apex/ToDoController.getTaskToUpdate';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ToDoList_CRUD extends LightningElement {
    @track taskName = '';
    @track taskStatus = 'Not Started';
    @track taskDueDate;
    @track tasks = [];
    @track taskId = '';
    wiredTasksResult;

    statusOptions = [
        { label: 'Not Started', value: 'Not Started' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Completed', value: 'Completed' }
    ];

    @wire(getTasks)
    wiredTasks(result) {
        this.wiredTasksResult = result;
        if (result.data) {
            this.tasks = result.data;
        } else if (result.error) {
            this.showToast('Error', 'Error fetching tasks', 'error');
        }
    }

    handleTaskNameChange(event) {
        this.taskName = event.target.value;
    }

    handleStatusChange(event) {
        this.taskStatus = event.target.value;
    }

    handleDueDateChange(event) {
        this.taskDueDate = event.target.value;
    }

    handleAddTask() {
        if (this.taskName.trim() === '') return;
        
        addTask({ taskName: this.taskName, status: this.taskStatus, dueDate: this.taskDueDate })
            .then(() => {
                this.showToast('Success', 'Task added successfully', 'success');
                return refreshApex(this.wiredTasksResult);
            })
            .catch(error => this.showToast('Error', error.body.message, 'error'));

        this.resetForm();
    }

    handleDeleteTask(event) {
        const taskId = event.target.dataset.id;
        deleteTask({ taskId })
            .then(() => {
                this.showToast('Success', 'Task deleted successfully', 'success');
                return refreshApex(this.wiredTasksResult);
            })
            .catch(error => this.showToast('Error', error.body.message, 'error'));
    }

    handleEditButton(event) {
        this.taskId = event.target.dataset.id;

        getTaskToUpdate({ taskId: this.taskId })
            .then(task => {
                this.taskName = task.Name;
                this.taskStatus = task.Status__c;
                this.taskDueDate = task.Due_Date__c;
            })
            .catch(error => this.showToast('Error', error.body.message, 'error'));
    }

    handleUpdateTask() {
        if (!this.taskId) return;

        const updatedTask = {
            Id: this.taskId,
            Name: this.taskName,
            Status__c: this.taskStatus,
            Due_Date__c: this.taskDueDate
        };

        updateTask({ updatedTask })
            .then(() => {
                this.showToast('Success', 'Task updated successfully', 'success');
                return refreshApex(this.wiredTasksResult);
            })
            .catch(error => this.showToast('Error', error.body.message, 'error'));

        this.resetForm();
    }

    resetForm() {
        this.taskId = '';
        this.taskName = '';
        this.taskStatus = 'Not Started';
        this.taskDueDate = null;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
