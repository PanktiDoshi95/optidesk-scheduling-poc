import { Component, OnInit } from '@angular/core';
import ItemMovement from 'gantt-schedule-timeline-calendar/dist/ItemMovement.plugin.js';
import CalendarScroll from 'gantt-schedule-timeline-calendar/dist/CalendarScroll.plugin.js';
import WeekendHighlight from 'gantt-schedule-timeline-calendar/dist/WeekendHighlight.plugin.js';
import Selection from 'gantt-schedule-timeline-calendar/dist/Selection.plugin.js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

    scheduling = [
        {
            orderId: 'order01',
            taskId: 'task01',
            resourceId: 'PML1',
            duration: 36000,
            operationId: 'OP01',
            label: 'Create Shampoo Liquid',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Pre-Mixing - 1',
            id: 'Task1',
        },
        {
            orderId: 'order01',
            taskId: 'task01',
            resourceId: 'ML1',
            duration: 7200,
            operationId: 'OP02',
            parentOperationId: 'PML1',
            label: 'Add Fragrance',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Mixing - 1',
            id: 'Task2',
            parentTaskID: 'Task1',
        },
        {
            orderId: 'order01',
            taskId: 'task01',
            resourceId: 'FL1',
            duration: 7200,
            operationId: 'OP03',
            parentOperationId: 'ML1',
            label: 'Fill Bottle',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Filling Line - 1',
            id: 'Task3',
            parentTaskID: 'Task2',
        },
        {
            orderId: 'order01',
            taskId: 'task01',
            resourceId: 'PL1',
            duration: 7200,
            operationId: 'OP04',
            parentOperationId: 'FL1',
            label: 'Packing Line',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Packing Line - 1',
            id: 'Task4',
            parentTaskID: 'Task3',
        },
        {
            orderId: 'order01',
            taskId: 'task02',
            resourceId: 'PML2',
            duration: 36000,
            operationId: 'OP01',
            label: 'Create Shampoo Liquid',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Pre-Mixing - 2',
            id: 'Task5',
            // parentTaskID: 'Task4',
        },
        {
            orderId: 'order01',
            taskId: 'task02',
            resourceId: 'ML2',
            duration: 7200,
            operationId: 'OP02',
            parentOperationId: 'PML2',
            label: 'Add Fragrance',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Mixing Line - 2',
            id: 'Task6',
            parentTaskID: 'Task5',
        },
        {
            orderId: 'order01',
            taskId: 'task02',
            resourceId: 'FL2',
            duration: 7200,
            operationId: 'OP03',
            parentOperationId: 'ML2',
            label: 'Fill Bottle',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Filling Line - 2',
            id: 'Task7',
            parentTaskID: 'Task6',
        },
        {
            orderId: 'order01',
            taskId: 'task02',
            resourceId: 'PL2',
            duration: 7200,
            operationId: 'OP04',
            parentOperationId: 'FL2',
            label: 'Packing Line',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Packing Line - 2',
            id: 'Task8',
            parentTaskID: 'Task7',
        },
        {
            orderId: 'order01',
            taskId: 'task03',
            resourceId: 'PML3',
            duration: 36000,
            operationId: 'OP01',
            label: 'Create Shampoo Liquid',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Pre-Mixing - 3',
            id: 'Task9',
            // parentTaskID: 'Task4',
        },
        {
            orderId: 'order01',
            taskId: 'task03',
            resourceId: 'ML3',
            duration: 7200,
            operationId: 'OP02',
            parentOperationId: 'PML3',
            label: 'Add Fragrance',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Mixing Line - 3',
            id: 'Task10',
            parentTaskID: 'Task9',
        },
        {
            orderId: 'order01',
            taskId: 'task03',
            resourceId: 'FL3',
            duration: 7200,
            operationId: 'OP03',
            parentOperationId: 'ML3',
            label: 'Fill Bottle',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Filling Line - 3',
            id: 'Task11',
            parentTaskID: 'Task10',
        },
        {
            orderId: 'order01',
            taskId: 'task03',
            resourceId: 'PL3',
            duration: 7200,
            operationId: 'OP04',
            parentOperationId: 'FL3',
            label: 'Packing Line',
            OrderQty: 5000,
            OrderUOM: 'PC',
            resourceLabel: 'Packing Line - 3',
            id: 'Task12',
            parentTaskID: 'Task11',
        },
    ];
    taskScheduling = [];
    rows = {};
    items = {};
    taskChilds = {};
    tasks = [];
    displayChart = false;
    config: any;
    gstcState: any;
    groupBytaskId = {};

    ngOnInit(): void {
        this.createSchedulingGroup();
        this.getOperationsByTask();
    }

    getOperationsByTask() {
        this.groupBytaskId = {};
        this.scheduling.forEach((a) => {
            if (!this.groupBytaskId.hasOwnProperty(a.taskId)) {
                this.groupBytaskId[a.taskId] = [];
            }
            this.groupBytaskId[a.taskId].push(a);
        });
    }

    createSchedulingGroup() {
        const statesSeen = {};
        const countesSeen = {};

        this.taskScheduling = this.scheduling.sort((a, b) => {
            const stateComp = a.taskId.localeCompare(b.taskId);
            return stateComp ? stateComp : a.taskId.localeCompare(b.taskId);
        }).map(x => {
            const operationSpan = statesSeen[x.taskId] ? 0 :
                this.scheduling.filter(y => y.taskId === x.taskId).length;
            statesSeen[x.taskId] = true;
            countesSeen[x.taskId] = countesSeen[x.taskId] || {};
            countesSeen[x.taskId][x.taskId] = true;

            return { ...x, operationSpan };
        });
    }

    addTaskToChart(data) {
        this.displayChart = true;
        const rowsCopy = JSON.parse(JSON.stringify(this.rows));
        const itemsCopy = JSON.parse(JSON.stringify(this.items));

        const isEmptyRows = Object.keys(rowsCopy).length === 0;
        const isEmptyItems = Object.keys(itemsCopy).length === 0;

        this.groupBytaskId[data.taskId].forEach(resource => {

            rowsCopy[resource.resourceId] = {
                id: resource.resourceId,
                label: resource.resourceLabel,
                parentId: resource.parentOperationId ? resource.parentOperationId : undefined,
                expanded: true,
                progress: 50,
            };

            const taskParent = rowsCopy[resource.resourceId].parentId;
            let taskStart = 0;
            let taskEnd = 0;

            if (!taskParent) {
                taskStart = new Date(2020, 8, 8, 1, 0, 0).getTime();
                taskEnd = taskStart + (resource.duration * 1000);
            } else {
                const parentEndTime = itemsCopy[resource.parentTaskID].time.end;
                taskStart = parentEndTime;
                taskEnd = parentEndTime + (resource.duration * 1000);
            }

            itemsCopy[resource.id] = {
                id: resource.id,
                label: resource.label,
                time: {
                    start: taskStart ? taskStart : 0,
                    end: taskEnd ? taskEnd : 0
                },
                rowId: resource.resourceId,
            };

            this.taskChilds[resource.id] = [];
            if (resource.parentTaskID) {
                this.taskChilds[resource.parentTaskID].push(resource.id);
            }

            this.rows = JSON.parse(JSON.stringify(rowsCopy));
            this.items = JSON.parse(JSON.stringify(itemsCopy));
        });

        if (!isEmptyRows && !isEmptyItems) {
            this.gstcState.update('config.list.rows', rowsCopy);
            this.gstcState.update('config.chart.items', itemsCopy);
            this.rows = JSON.parse(JSON.stringify(rowsCopy));
            this.items = JSON.parse(JSON.stringify(itemsCopy));
        }

        function addItemTitle(element, data) {
            let innerHTML = element.innerHTML;
            return {
                update(element, data) {
                    // element.classList.add('example-class');
                    element.title = data.item.label + ' - ' + 'Resourse : ' + data.row.label;

                    // const title = element.getAttribute('title');
                    // title.style['background-color'] = 'green';
                    // title.setAttribute('class', 'democlass');
                    // console.log(element.getAttribute('class'));

                    // element.title.setAttribute('style', 'background-color: yellow;');
                    // element.setAttribute('style', 'background-color: red;');

                    // innerHTML = innerHTML + '<a appHighlight data-title="GFG">Hi</a>';
                    // element.innerHTML = innerHTML;
                },
                destroy(element, data) {
                    element.title = '';
                    innerHTML = '';
                }
            };
        }

        const columns = {
            percent: 100,
            resizer: {
                inRealTime: true
            },
            data: {
                label: {
                    id: 'label',
                    data: 'label',
                    expander: true,
                    isHtml: true,
                    width: 230,
                    minWidth: 100,
                    header: {
                        content: 'Resources'
                    }
                },
                progress: {
                    id: 'progress',
                    data: 'progress',
                    width: 30,
                    header: {
                        content: '%'
                    }
                }
            }
        };

        this.config = {
            plugins: [
                ItemMovement({
                    moveable: true,
                    resizeable: false,
                    collisionDetection: false
                }),
                CalendarScroll({
                    speed: 1,
                    hideScroll: true,
                }),
                WeekendHighlight({
                    weekdays: [6, 0]
                }),
                Selection({
                    events: {
                        onSelecting(selecting, lastSelected) {
                            const filtered = selecting;
                            return filtered;
                        },

                        selected(data, type) {
                        }
                    }
                })
            ],
            height: 800,
            list: {
                rows: this.rows,
                columns
            },
            chart: {
                items: this.items
            },
            actions: {
                'chart-timeline-items-row-item': [addItemTitle]
            },
            slots: {
                // 'chart-timeline-items-row-item': { inner: [itemSlot] },
            },
        };
    }

    async removeTask(data) {
        const task: any = await this.removeOperationByTaskId(data.taskId);
        console.log('task', task);
        // this.gstcState.update('config.list.rows', task.rowsCopy);
        // this.rows = JSON.parse(JSON.stringify(task.rowsCopy));
        // this.items = JSON.parse(JSON.stringify(task.itemsCopy));
        console.log('state', this.gstcState);
    }

    removeOperationByTaskId(taskId) {
        return new Promise((resolve, reject) => {
            const totalOperation = this.groupBytaskId[taskId].length;
            console.log('total', totalOperation);
            const rowsCopy = JSON.parse(JSON.stringify(this.rows));
            const itemsCopy = JSON.parse(JSON.stringify(this.items));
            this.groupBytaskId[taskId].reverse().forEach((operation, index) => {
                console.log('operations', operation, 'index', index);
                delete rowsCopy[operation.resourceId];
                delete itemsCopy[operation.id];
                this.gstcState.update('config.list.rows', rowsCopy);
                this.gstcState.update('config.chart.items', itemsCopy);
                this.rows = JSON.parse(JSON.stringify(rowsCopy));
                this.items = JSON.parse(JSON.stringify(itemsCopy));
                if (totalOperation - 1 === index) {
                    resolve({ rowsCopy, itemsCopy });
                }
            });
        });
    }


    onState(state) {
        this.gstcState = state;
        let itemsCopy = JSON.parse(JSON.stringify(this.items));
        this.gstcState.subscribe('config.chart.items.:id',
            (bulk, eventInfo) => {
                if (eventInfo.type === 'update' && eventInfo.params.id) {
                    const itemId = eventInfo.params.id;
                    const newItemObj = this.gstcState.get('config.chart.items.' + itemId);
                    const oldItemObj = this.items[itemId];
                    const timeDiff = newItemObj.time.start - oldItemObj.time.start;
                    this.taskChilds[itemId].forEach(childTaskId => {
                        const childItemObj = this.items[childTaskId];
                        this.gstcState.update('config.chart.items.' + childTaskId + '.time.start', childItemObj.time.start + timeDiff);
                        this.gstcState.update('config.chart.items.' + childTaskId + '.time.end', childItemObj.time.end + timeDiff);
                    });
                    itemsCopy = this.gstcState.get('config.chart.items');
                    this.gstcState.update('config.chart.items', itemsCopy);
                    this.items = JSON.parse(JSON.stringify(itemsCopy));
                }
            },
            { bulk: true }
        );
    }
}
