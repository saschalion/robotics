import * as React from "react";
import * as Server from "Models/ServerInterfaces";
import * as Tools from "Utils/Tools";

import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/ru';

import classNames from "classnames";

import { connect } from "react-redux";

import { CustomPage } from "Components/CustomPage";
import { Dispatch } from "redux";
import { Loading } from "Components/Common/Loading/Loading";
import { StoreState } from "Store/StoreState";
import { UsersState } from "Store/State/UsersState";
import { getUsers, changeSortOrder } from "ActionCreators/UsersActionCreators";
import { RolesState } from "Store/State/RolesState";
import { getRoles } from "ActionCreators/RolesActionCreators";
import { Header } from "./Header";

const styles: any = require("./Users.module.sass");

interface IUsersProps
{
	getUsers?: () => Promise<{}>;
	users?: UsersState;
	getRoles?: () => Promise<{}>;
	roles?: RolesState;
	changeSortOrder?: () => Promise<{}>;
}

@connect(mapStateToProps, mapDispatchToProps)
export class Users extends CustomPage<IUsersProps, {}> {
	componentDidMount() {
		const {users, roles} = this.props;

		if (!users.items.length || !roles.items.length) {
			this.props.getUsers();
			this.props.getRoles();
		}
	}

	private renderHeader(): JSX.Element {
		return (
			<Header title={"Пользователи"} buttonCaption={"Добавить нового пользователя"}/>
		);
	}

	private renderToolbar(): JSX.Element {
		const {users, changeSortOrder} = this.props;
		return (
			<div className={styles['users__toolbar']}>
				<div
					className={classNames(styles['users__toolbar-sort'], !users.sortedAsc && styles['_desc'])}
					onClick={() => {
						changeSortOrder();
					}}
				>
					Сортировать от А до Я
					<i className={styles['users__toolbar-sort-icon']} />
				</div>
				<div className={styles['users__toolbar-count']}>
					{`Всего пользователей: ${users.items.length}`}
				</div>
			</div>
		);
	}

	private renderTable(): JSX.Element {
		return (
			<div className={styles['users__table']}>
				<div className={styles['users__table-header']}>
					{this.renderTableHeader()}
				</div>
				<div className={styles['users__table-body']}>
					{this.renderTableBody()}
				</div>
			</div>
		);
	}

	private renderTableHeader(): JSX.Element {
		return (
			<div className={styles['users__table-header']}>
				<div className={styles['users__table-col']}>
					№
				</div>
				<div className={classNames(styles['users__table-col'], styles['_col_name'])}>
					ФИО пользователя
				</div>
				<div className={classNames(styles['users__table-col'])}>
					Роль
				</div>
				<div className={classNames(styles['users__table-col'])}>
					Дата рождения
				</div>
				<div className={classNames(styles['users__table-col'])}>
					Место рождения
				</div>
				<div className={classNames(styles['users__table-col'])}>
					Почта
				</div>
				<div className={classNames(styles['users__table-col'])}>
					Телефон
				</div>
				<div className={classNames(styles['users__table-col'])}>
					Регистрация
				</div>
				<div className={classNames(styles['users__table-col'])}>
					Изменение
				</div>
				<div className={classNames(styles['users__table-col'], styles['_col_edit'])}>
					ред.
				</div>
				<div className={classNames(styles['users__table-col'], styles['_col_delete'])}>
					удалить
				</div>
			</div>
		);
	}

	private renderTableBody(): JSX.Element {
		const {users, roles} = this.props;
		let items: JSX.Element[] = [];

		users.items
			.sort((item1, item2) => {
				const fio1 = Tools.getFIO(item1.surname, item1.surname, item1.middleName);
				const fio2 = Tools.getFIO(item1.surname, item1.surname, item1.middleName);
				if (users.sortedAsc) {
					if (fio1 == fio2) {
						return item1.id < item2.id ? -1 : 1;
					} else {
						return fio1 < fio2 ? -1 : 1;
					}
				} else {
					if (fio1 == fio2) {
						return item1.id < item2.id ? 1 : -1;
					} else {
						return fio1 < fio2 ? 1 : -1;
					}
				}
			})
			.forEach((user: Server.User, index: number) => {
				const fio = Tools.getFIO(user.surname, user.surname, user.middleName);
				items.push(
					<div className={styles['users__table-row']} key={index}>
						<div className={classNames(styles['users__table-col'])}>
							{index + 1}
						</div>
						<div className={classNames(styles['users__table-col'], styles['_col_name'])}>
							{fio}
						</div>
						<div className={classNames(styles['users__table-col'])}>
							{user.role ? user.role.title : ""}
						</div>
						<div className={classNames(styles['users__table-col'])}>
							<Moment format={'DD.MM.YYYY'} locale="ru" date={user.birthday} />
						</div>
						<div className={classNames(styles['users__table-col'])}>
							{user.birthPlace}
						</div>
						<div className={classNames(styles['users__table-col'])}>
							{user.email}
						</div>
						<div className={classNames(styles['users__table-col'])}>
							{user.phoneNumber}
						</div>
						<div className={classNames(styles['users__table-col'])}>
							<Moment format={'DD.MM.YYYY'} locale="ru" date={user.registerDate} />
						</div>
						<div className={classNames(styles['users__table-col'])}>
							<Moment format={'DD.MM.YYYY'} locale="ru" date={user.lastUpdate} />
						</div>
						<div className={classNames(styles['users__table-col'], styles['_col_edit'])}>
							{/*// TODO: редактирование*/}
						</div>
						<div className={classNames(styles['users__table-col'], styles['_col_delete'])}>
							{/*// TODO: удаление*/}
						</div>
					</div>
				);
			});

		return (
			<div className={styles['users__table-body']}>
				{items}
			</div>
		);
	}

	renderContent(): React.ReactElement<{}> {
		const { users } = this.props;

		if (users.itemsInRequest) {
			return <Loading />;
		}

		if (!users.items.length) {
			return null;
		}

		return (
			<section className={styles['users']}>
				{this.renderHeader()}
				<div className={styles['users__inner']}>
					{this.renderToolbar()}
					{this.renderTable()}
				</div>
			</section>
		);
	}
}

function mapStateToProps(state: StoreState): IUsersProps {
	return {
		users: state.users,
		roles: state.roles
	}
}

function mapDispatchToProps(dispatch: Dispatch<{}>): IUsersProps {
	return {
		getUsers: () => dispatch(getUsers()),
		getRoles: () => dispatch(getRoles()),
		changeSortOrder: () => dispatch(changeSortOrder()),
	};
}