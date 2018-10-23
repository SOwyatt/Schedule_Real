function Schedule(obj) {
    //Obj should be an object with days and priority

    this.days =  obj.days();

}

function ScheduleGuide(obj) {
    //Obj should be an object with setDays, priority, and requests
    this.setDays = obj.setDays;
    this.priority = obj.priority;
    this.requests = obj.requests;
}

function Request(obj) {
    //Obj should be an object with type, and date
    this.date = obj.date;
    this.type = obj.type; //Type should be an integer between 0 and 3, 0 being requesting an extra day, 1 a day off, 2 a day that absolutley can not be worked
}

module.exports = {
    Schedule : Schedule,
    ScheduleGuide : ScheduleGuide
}