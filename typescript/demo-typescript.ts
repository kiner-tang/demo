enum Role {
    student="学生",
    teacher="老师",
    worker="工人",
    engineer="工程师"
}

interface PersonInfoStruct {
    role?: Role,
    name?: string,
    age?: number
}

class Person {
    constructor(private info: PersonInfoStruct) {
    }
    updateInfo(info: PersonInfoStruct): void{
        this.info = {
            ...this.info,
            ...info
        }
    }
    getInfo(msg: string): string{
        return `你好,我叫${this.info.name},今年${this.info.age}岁,我是一名${this.info.role},${msg}`;
    }
    say(msg: string): void{
        console.log(this.getInfo(msg));
    }
}

let pStudent = new Person({
    role: Role.student,
    name: "小灰灰",
    age: 18
});
let pTeacher = new Person({
    role: Role.student,
    name: "灰太狼",
    age: 33
});
let pWorker = new Person({
    role: Role.student,
    name: "美羊羊",
    age: 12
});
let pEngineer = new Person({
    role: Role.student,
    name: "喜洋洋",
    age: 22
});

pStudent.say("你好，很高兴遇见你");
pTeacher.say("你好，很高兴遇见你");
pWorker.say("你好，很高兴遇见你");
pEngineer.say("你好，很高兴遇见你");

pTeacher.updateInfo({
    name: "红太狼"
});
pTeacher.say("你好，很高兴遇见你");