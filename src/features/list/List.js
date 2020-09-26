import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getElement,
  addToTodo,
  editToTodo,
  deleteFromTodo,
  selectList,
  selectElement,
} from './reducer';
import styles from './List.module.css';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export function List() {
  const [modalType, changeModalType] = useState('add');
  const [modalOpen, changeModalState] = useState(false);

  const list = useSelector(selectList);
  let listCopy = list;
  let pendingList = list && list.filter(ele => ele.status === 'pending');
  let completedList = list && list.filter(ele => ele.status === 'completed');
  const element = useSelector(selectElement);
  const dispatch = useDispatch();

  function Element(props) {
    return <div key={props.index + 1} className={styles.list_row}>
      <p className={styles.list_row_child}><strong>Priority:</strong> {props.ele && props.ele.priority}</p>
      <p className={styles.list_row_child}><strong>Title:</strong> {props.ele && props.ele.title}</p>
      <p className={styles.list_row_child}><strong>Created On:</strong> {props.ele && props.ele.createdAt}</p>
      <p className={styles.list_row_child}><strong>Due By:</strong> {props.ele && props.ele.dueDate}</p>
      <button className={styles.list_row_child} onClick={() => {
        const payload = {
          ...element,
          status: (props.ele && props.ele.status) === 'pending' ? 'completed' : 'pending'
        };
        dispatch(editToTodo({
          id: element && element.id,
          data: payload
        }));
      }}>
        {((props.ele && props.ele.status) === 'pending' ? 'Close' : 'Open') + ' Task'}
      </button>
      <button className={styles.list_row_child} onClick={() => {
        dispatch(getElement(props.ele && props.ele.id));
        changeModalType('edit');
        changeModalState(true);
      }}>Edit</button>
      <button className={styles.list_row_child} onClick={() => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
          dispatch(deleteFromTodo(props.ele && props.ele.id));
        }
      }}>Delete</button>
    </div>
  }

  return (
    <div>
      <div className={styles.row}>
        <button style={{ marginBottom: '20px' }} onClick={() => {
          changeModalType('add');
          changeModalState(true);
        }}>Add Task</button>
        <Tabs>
          <TabList>
            <Tab>All Tasks</Tab>
            <Tab>Pending Tasks</Tab>
            <Tab>Completed Tasks</Tab>
          </TabList>

          <TabPanel>
            {(listCopy && listCopy.reverse().map((ele, index) => <Element index={index} ele={ele}/>)) || <p>No tasks created!</p>}
          </TabPanel>
          <TabPanel>
            {(pendingList.length > 0 && pendingList.reverse().map((ele, index) => <Element index={index} ele={ele}/>)) || <p>No pending tasks created!</p>}
          </TabPanel>
          <TabPanel>
            {(completedList.length > 0 && completedList.reverse().map((ele, index) => <Element index={index} ele={ele}/>)) || <p>No completed tasks created!</p>}
          </TabPanel>
        </Tabs>
      </div>

      {modalOpen && <Modal isOpen={modalOpen} onRequestClose={() => {
        changeModalType('add');
        changeModalState(false);
      }}>
          <h4>{(modalType === 'add' ? 'Add' : 'Edit') + ' Task'}</h4>
          <form name="modal" style={{ display: 'flex' }} onSubmit={(event) => {
            event.preventDefault();
            const form = document.forms['modal'];
            const payload = {
              title: form.elements.title.value,
              description: form.elements.description.value,
              dueDate: form.elements.dueDate.value,
              priority: form.elements.priority.value,
              status: 'pending'
            }
            modalType === 'add'
                ? dispatch(addToTodo(payload))
                : dispatch(editToTodo({
                  id: element && element.id,
                  data: payload
                }));
            changeModalState(false);
          }}>
            <input type="text" placeholder="enter title" name="title" required
                   defaultValue={(modalType === 'edit' && element.title) || ''}/>
            <textarea placeholder="enter description" name="description" required
                      defaultValue={(modalType === 'edit' && element.description) || ''}/>
            <input type="date" name="dueDate" required
                   defaultValue={(modalType === 'edit' && element.dueDate) || new Date().toISOString()}/>
            <select defaultValue={modalType === 'edit' ? element.priority : "None"} name="priority" required>
              <option value="None">None</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button type="submit">Submit</button>
          </form>
      </Modal>}
    </div>
  );
}
