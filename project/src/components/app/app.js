import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';

import './app.css';
import ItemAddForm from '../item-add-from';


export default class App extends Component {

  maxId = 100;

  state = {
    todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Have a lunch')
    ],
    //SearchPanel
    term: '',
//ItemStatusFilter
    filter: 'all'
  };
 // Возвращает поля state
  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++   
    }
  }


  deleteItem = (id) => { 
    this.setState(({ todoData }) => {
      //получаем id удаляемого el
      const idx = todoData.findIndex((el) => el.id === id);
      //соединяем до, и после удаляемого el(idx + 1)
      //
      const newArray = [
        ...todoData.slice(0, idx),
        ...todoData.slice(idx  + 1)
      ];

      return {
        todoData: newArray
      };
    });
  };
//добавляет el с текстом = label (createTodoItem(label))
  addItem = (text) => {

    const newItem = this.createTodoItem(text);

    this.setState(({todoData}) => {

      const newArr = [
        ...todoData,
        newItem
      ];

      return {
        todoData: newArr
      }
    });
  };

  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) =>el.id === id);

      const oldItem = arr[idx];
      //новый элемент
      const newItem = { ...oldItem,//копируем све свойства el
         [propName]: !oldItem.done};//меняем done на противоположный этого el

      return [
        ...arr.slice(0, idx),
        newItem,
        ...arr.slice(idx  + 1)
      ]; 
  }
 
  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    });

  }

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    });
  };

search (items, term) {
  if (term.length === 0) {
    return items;
  }
  return items.filter((item) => {
    return item.label.toLowerCase()
    .indexOf(term.toLowerCase()) > -1;
  })
}
onSearchChange =  (term) => {
  this.setState({term});
};

onFilterChange =  (filter) => {
  this.setState({filter});
};

  filter(items, filter) {
  switch(filter) {
    case 'all'  :
      return items;
    case 'active' :
      return items.filter((item) => !item.done);
    case 'done' :
        return items.filter((item) => item.done)
     default: return items;
  }
}


  render() {
    const { todoData, term, filter } = this.state;

    const visibleItems = this.filter(this.search(todoData, term), filter);

    const doneCount = todoData.filter((el) => el.done).length;
    const todoCount = todoData.length - doneCount;

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel
           onSearchChange={this.onSearchChange}/>

          <ItemStatusFilter
          filter={filter}
          onFilterChange={this.onFilterChange}
           />
        </div>
  
        <TodoList
         todos={visibleItems} 
         onDeleted={ this.deleteItem }
         onToggleImportant={this.onToggleImportant}
         onToggleDone={this.onToggleDone}
         />
         
         <ItemAddForm
         onItemAdded={this.addItem}/>
      </div>
    );
  }
};