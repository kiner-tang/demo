var Role;
(function (Role) {
    Role[Role["student"] = "学生"] = "student";
    Role[Role["teacher"] = "老师"] = "teacher";
    Role[Role["worker"] = "工人"] = "worker";
    Role[Role["engineer"] = "工程师"] = "engineer";
})(Role || (Role = {}));
var Person = (function () {
    function Person(role, name, age) {
        this.role = role;
        this.name = name;
        this.age = age;
    }
    Person.prototype.getInfo = function (msg) {
        return "\u4F60\u597D,\u6211\u53EB" + this.name + ",\u4ECA\u5E74" + this.age + "\u5C81,\u6211\u662F\u4E00\u540D" + this.role + "," + msg;
    };
    Person.prototype.say = function (msg) {
        console.log(this.getInfo(msg));
    };
    return Person;
})();
var pStudent = new Person(Role.student, "小灰灰", 20);
var pTeacher = new Person(Role.teacher, "灰太狼", 18);
var pWorker = new Person(Role.worker, "美羊羊", 12);
var pEngineer = new Person(Role.engineer, "喜洋洋", 22);
pStudent.say("你好，很高兴遇见你");
pTeacher.say("你好，很高兴遇见你");
pWorker.say("你好，很高兴遇见你");
pEngineer.say("你好，很高兴遇见你");
