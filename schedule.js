function Schedule(obj) {
    //Obj should be an object with days and priority

    this.days =  obj.days();
    this.priority = obj.priority;

}

function ScheduleGuide(obj) {
    this.setDays = obj.setDays;
}

module.exports = {
    Schedule : Schedule,
    ScheduleGuide : ScheduleGuide
}