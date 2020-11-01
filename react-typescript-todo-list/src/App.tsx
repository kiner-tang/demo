import React, { useState } from "react";
import "./App.css";

// [Typescript] 对于一些有限的数据集合，可以使用枚举类型进行描述
// 显示类型，包括显示所有事项、显示未完成事项、显示已完成事项
export enum ShowType {
  all,
  active,
  done,
}
// [Typescript] 对于一些对象，我们可以使用`interface`将其结构和字段的数据类型描述出来，
// 编辑器将根据这个结构和数据类型进行类型校验和提示
// 每一事项的结构，包括事项的id,事项的内容content,该事项是否已完成isDone
export interface TodoListItem {
  id: string;
  content: string;
  isDone: boolean;
}
// 切换显示方式的tab的结构，包括显示的文字label,以及对应的值是ShowType类型的枚举值
export interface TabItem {
  label: string;
  value: ShowType;
}

// [Typescript&React] 在React中，通过对状态的修改打到更新界面的目的，类似于Vue中的data
// 此处定义了App的状态对象结构
// inputValue 用户输入的文本框的值
// list       所有事项列表，是由`TodoListItem`组成的数组
// showType   当前要显示什么类型的事项
export interface AppState {
  inputValue: string,
  list: TodoListItem[];
  showType: ShowType;
}
// 工具方法，用于创建全局唯一的id
function createUUID(): string {
  return `${Math.random() * 9999999999999}_${Date.now()}`
}

// [Typescript] 用于创建一个新的事项，传入事项的内容content,字符串类型,返回一个事项，其结构为`TodoListItem`
function createTodoItem(content: string): TodoListItem {
  return {
    id: createUUID(),
    content,
    isDone: false
  }
}
const storageKey = "kiner-todo-list";

// 为简化逻辑，我们在这里不使用接口和React全家桶中的Store解决方案，仅仅将我们的数据存储到本地存储即可
// 需要时直接从本地存储获取回来
function initStore(): TodoListItem[] {
  let old: any = localStorage.getItem(storageKey);
  if (old) {
    try {
      old = JSON.parse(old);
    } catch (e) {
      old = [];
    }
  } else {
    old = [];
  }
  return old;
}

// [React] 在React中有两种创建组件的方式，一种是通过Class方式构建，另一种是通过函数方式实现，
// [React] 他们简单介绍和各自的优缺点以及使用场景，详见：http://www.ruanyifeng.com/blog/2019/09/react-hooks.html
// 此处为了演示以及功能相对简单，因此采用的是函数式组件
function App() {
  // 将之前的待办事项获取回来，作为初始化状态的值进行输入
  let old = initStore();

  // [React&Typescript] 在函数式组件中，如果想要使用状态，需要使用React Hooks中的`useState`hooks
  // [React&Typescript] userState<AppState>是`Typescript`的类型约束方式，意思是我创建的state，他的结构是`AppState` 
  // [React] useState会返回一个数组，数组第一个元素就是我们的状态，第二个元素是用来改变这个状态的方法
  const [state, setState] = useState<AppState>({
    inputValue: "",
    list: old,
    showType: ShowType.all,
  });

  // 定义我们几个Tab的结构
  const tabList: TabItem[] = [
    {
      label: "所有事项",
      value: ShowType.all,
    },
    {
      label: "未完事项",
      value: ShowType.active,
    },
    {
      label: "已完事项",
      value: ShowType.done,
    },
  ];

  // 将状态中的list,即事项列表取出来，我们需要对他进行一定的加工之后再渲染到页面上，这个操作类似于`Vue`中的`Computed`,也就是计算属性
  const list = state.list;
  // 对原始数据列表根据当前显示类型进行过滤
  // 1. 如果当前显示类型为:ShowType.all,即显示所有事项，则直接返回所有事项即可
  // 2. 如果当前显示类型为:ShowType.active,即只显示代办事项，则需要把事项列表中的已完成事项过滤掉，只返回代办事项
  // 3. 如果当前显示类型为:ShowType.done,即只显示已完成事项，则需要把事项列表中的代办事项过滤掉，只返回已完成事项
  const renderList = list.filter((todoItem: TodoListItem) => {
    return state.showType === ShowType.all ||
      (state.showType === ShowType.active && !todoItem.isDone) ||
      (state.showType === ShowType.done && todoItem.isDone)
  });

  // 由于我们的状态使用的是一个对象，为了方便更新状态中的某一个属性的值，如只更新`showType`的值，我们封装一个工具方法，
  // 使我们只需要传入一个新的对象，这个方法会自动帮我们将新旧状态合并并更新
  const updateState = (partialState: any) =>
    setState(oldState => ({
      ...oldState,
      ...partialState
    }));

  // 用于添加代办事项
  function add(): void {
    if (!state.inputValue.trim().length) {
      alert('请输入代办事项的内容');
      return;
    }
    // 将用户输入的事项内容使用`createTodoItem`方法创建一个代办事项并塞到事项列表中
    list.push(createTodoItem(state.inputValue));
    // [React] 不同于`Vue`的数据响应式，在React中，如果数据改变了，想要重新渲染页面，需要调用`setState`方法进行更新，
    // [React] 我们上面封装了一个便捷操作方法`updateState`便是为了这个目的
    // 将新的列表传入，并将文本框中的文字情况
    updateState({
      list,
      inputValue: ""
    });
    // 由于没有请求接口，我们使用此方法将我们的数据保存到localStorage中进行数据持久化
    saveStore();
  }

  // 将我们的事项列表保存在localStorage中，这样刷新页面就不会导致之前添加的代办事项丢失
  function saveStore() {
    localStorage.setItem(storageKey, JSON.stringify(list));
  }


  return (
    <div className="App">
      <div className="input-box">
        <input
          type="text"
          placeholder="请输入待办事项"
          // 将状态中的inputValue绑定到value中，一旦我们的inputValue发生变化重新渲染时，
          // 我们的文本框里面的内容也会相应变化
          value={state.inputValue}
          // 当用户输入时，我们需要实时更新inputValue
          // 这一步与上面绑定value一起，在Vue中一般是使用v-model进行双向绑定的
          onChange={e => updateState({ inputValue: e.target.value })}
          // 当用户在文本框中输入回车时，我们就执行增加代办事项方法进行添加待办事项
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === "enter") {
              add();
            }
          }}
        />
        {/* 点击按钮时也同样执行添加代办事项的方法 */}
        <button className="add-btn" onClick={() => {
          add();
        }}>添加代办事项</button>
      </div>
      <div className="todo-list-penel">
        {/* 用于切换显示类型的tab栏 */}
        <div className="tab-box">
          {/* [React] 在React中，如果需要循环遍历一个数组，一般采用数组的map方法，返回一个ReactNode，也就是jsx表达式 */}
          {tabList.map((tab: TabItem) => (
            <div
              // [react] 注意，再循环列表是，需要给循环生成的最外层元素加上唯一的key，以防止渲染异常和提高渲染性能
              key={tab.label}
              // 根据当前显示类型的不同让指定的tab处于激活状态
              className={`tab${state.showType === tab.value ? " active" : ""}`}
              onClick={() => {
                updateState({
                  showType: tab.value
                })
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className="list-box">
          {
            renderList.map((todoItem: TodoListItem, index: number) => <div
              className={`todo-item${todoItem.isDone ? ' done' : ''}`}
              key={`${todoItem.id}`}
              onClick={() => {
                // 我们要将一个已完成事项改为未完成，或将一个未完成事项改为已完成，首先，先拿到这个事项在整个列表中索引
                const itemIdx = list.findIndex(item => item.id === todoItem.id);
                // 改变当前事项的完成状态
                todoItem.isDone = !todoItem.isDone;
                // 对事项列表进行原地修改
                list.splice(itemIdx, 1, todoItem);
                // 更新列表触发重新渲染
                updateState({
                  list
                });
                // 数据持久化
                saveStore();
              }}
            >
              <span className="checkbox"></span>
              <span className="idx">{index + 1}</span>
              <span className="content">{todoItem.content}</span>
            </div>)
          }
          {/* 当当前列表没有事项时，显示提示文字 */}
          {
            !renderList.length && <div className="no-record">暂无记录</div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
