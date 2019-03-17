import React from 'react';
import {
	Table,
	message
} from 'antd';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import Http from '../../server/API.server';
import { formatDate } from '../../utils/tool';

@observer
class OrderManage extends React.Component {
	constructor(props) {
		super(props);
		this.state = observable({
			userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
			columns: [
				{
					title: '房源名称',
					key: 'name',
					render: (text, record) => {
						return (
							<span>{record.houses && record.houses.name}</span>
						)
					}
				},
				{
					title: '位置',
					key: 'address',
					render: (text, record) => {
						const house = record.houses || {}
						const address = `${house.province} ${house.city} ${house.region} ${house.addrDetail}`
						return (
							<span>{address}</span>
						)
					}
				},
				{
					title: '金额',
					dataIndex: 'totalPrice'
				},
				{
					title: '入住时间',
					dataIndex: 'beginTime'
				},
				{
					title: '退房时间',
					dataIndex: 'endTime'
				}
			],
			tableData: [],
			pageSize: 10,
			pageNo: 1
		})
	}

	componentDidMount() {
		const _this = this;
		_this.getOrderList();
	}

	/**
	 * 获取订单列表
	 */
	@action
	getOrderList = () => {
		const _this = this;
		Http.order.getOrderList({
			status: 2,
			userId: _this.state.userId,
			pageSize: 10,
			pageNo: 1
		}).then(res => {
			console.log(res)
			if (res.code === 0) {
				res.data.forEach((item, i) => {
					item.key = i;
					item.beginTime = formatDate(item.beginTime);
					item.endTime = formatDate(item.endTime);
				})
				_this.state.tableData = [].concat(res.data);
			}
		})
	}

	render() {
		const _this = this;
		const { columns, tableData, pageSize, pageNo } = _this.state;


		return (
			<div className="order-manage">
				<p className="page-title">
					<i></i>
					订单管理
				</p>
				<div className="order-table">
					<Table
						columns={columns}
						dataSource={tableData}
						pagination={{
							pageSize,
							current: pageNo
						}}></Table>
				</div>
			</div>
		)
	}
}

export default OrderManage;