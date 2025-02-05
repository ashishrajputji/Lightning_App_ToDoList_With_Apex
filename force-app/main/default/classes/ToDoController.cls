public with sharing class ToDoController {
    @AuraEnabled(cacheable = true)
    public static List<Task__c> getTasks(){
        try {
            return [SELECT Id, Name, Status__c, Due_Date__c FROM Task__c ORDER BY CreatedDate DESC];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static Task__c addTask(String taskName, String status, Date dueDate) {
        try {
            Task__c newTask = new Task__c(Name = taskName, Status__c = status, Due_Date__c = dueDate);
            insert newTask;
            return newTask;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteTask(Id taskId){
        try {
            delete [SELECT Id FROM Task__c WHERE Id = :taskId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateTask(Task__c updatedTask){
        try {
            update updatedTask;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable = true)
    public static Task__c getTaskToUpdate(Id taskId){
        try {
            return [SELECT Id, Name, Status__c, Due_Date__c FROM Task__c WHERE Id = :taskId LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
