// 将以下Js风格的代码改写成Typescript风格的代码

const roleMap = {
    "student": "学生",
    "teacher": "老师",
    "worker": "工人",
    "engineer": "工程师",
};

class Person{
    constructor(person) {
        this.person = person;
    }
    updateInfo(person){
        this.person = {
            ...this.person,
            person
        };
    }
    getInfo(msg){
        return `你好,我叫${this.person.name},今年${this.person.age}岁,我是一名${roleMap[this.person.role]},${msg}`;
    }
    say(msg){
        console.log(this.getInfo(msg));
    }
}

let pStudent = new Person("student", "小灰灰", 20);
let pTeacher = new Person("teacher", "灰太狼", 18);
let pWorker = new Person("worker", "美羊羊", 12);
let pEngineer = new Person("engineer", "喜洋洋", 22);

pStudent.say("你好，很高兴遇见你");
pTeacher.say("你好，很高兴遇见你");
pWorker.say("你好，很高兴遇见你");
pEngineer.say("你好，很高兴遇见你");


pTeacher.updateInfo({
    name: "红太狼"
});
pTeacher.say("你好，很高兴遇见你");
