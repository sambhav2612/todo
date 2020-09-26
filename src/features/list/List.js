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
import { Table } from 'antd';
import moment from 'moment';

export function List() {
  const [sorter, changeSorting] = useState({});
  const [modalType, changeModalType] = useState('add');
  const [modalOpen, changeModalState] = useState(false);

  const list = useSelector(selectList);
  const pendingList = list && list.filter(ele => ele.status === 'pending');
  const completedList = list && list.filter(ele => ele.status === 'completed');
  const element = useSelector(selectElement);
  const dispatch = useDispatch();

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a['title'] > b['title'] ? 1 : -1,
      sortOrder: sorter.columnKey === 'title' && sorter.order,
      ellipsis: true,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a['priority'] > b['priority'] ? 1 : -1,
      sortOrder: sorter.columnKey === 'priority' && sorter.order,
      ellipsis: true,
    },
    {
      title: 'Created On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => a['createdAt'] > b['createdAt'] ? 1 : -1,
      sortOrder: sorter.columnKey === 'createdAt' && sorter.order,
      ellipsis: true,
      render: (row) => <div>{moment(row.createdAt).format('DD/MM/YYYY')}</div>
    },
    {
      title: 'Due By',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => a['dueDate'] > b['dueDate'] ? 1 : -1,
      sortOrder: sorter.columnKey === 'dueDate' && sorter.order,
      ellipsis: true,
      render: (row) => <div>{moment(row.dueDate).format('DD/MM/YYYY')}</div>
    },
    {
      title: 'Actions',
      key: 'action',
      render: (row) => <div>
        <button className={styles.list_row_child} onClick={() => {
          const payload = {
            ...row,
            status: (row.status) === 'pending' ? 'completed' : 'pending'
          };
          dispatch(editToTodo({
            id: row.id,
            data: payload
          }));
        }}>
          {((row.status) === 'pending' ? 'Close' : 'Open') + ' Task'}
        </button>
        <button className={styles.list_row_child} onClick={() => {
          dispatch(getElement(row.id));
          changeModalType('edit');
          changeModalState(true);
        }}>Edit</button>
        <button onClick={() => {
          if (window.confirm("Are you sure you want to delete this listing?")) {
            dispatch(deleteFromTodo(row.id));
          }
        }}>Delete</button>
      </div>
    }
  ];

  function onTableChange(pagination, filters, sorter) {
    changeSorting(sorter);
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
            {(list && list.length > 0 && <Table columns={columns || []} dataSource={list || []} onChange={onTableChange}/>) || <p>No tasks created!</p>}
          </TabPanel>
          <TabPanel>
            {(pendingList && pendingList.length > 0 && <Table columns={columns || []} dataSource={pendingList || []} onChange={onTableChange}/>) || <p>No pending tasks created!</p>}
          </TabPanel>
          <TabPanel>
            {(completedList && completedList.length > 0 && <Table columns={columns || []} dataSource={completedList || []} onChange={onTableChange}/>) || <p>No completed tasks created!</p>}
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
              status: 'pending',
              createdAt: modalType === 'add' ? new Date().toISOString() : element.createdAt,
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
                   defaultValue={(modalType === 'edit' && element.dueDate) || ''c}/>
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
