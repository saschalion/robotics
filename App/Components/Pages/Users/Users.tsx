import * as React from "react";
import * as Server from "Models/ServerInterfaces";
import * as Tools from "Utils/Tools";
import {PhoneNumberFormat} from 'google-libphonenumber';

import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/ru';
import moment from 'moment';

import classNames from "classnames";

import { connect } from "react-redux";

import { CustomPage } from "Components/CustomPage";
import { Dispatch } from "redux";
import { Loading } from "Components/Common/Loading/Loading";
import { StoreState } from "Store/StoreState";
import { UsersState } from "Store/State/UsersState";
import { getUsers, changeSortOrder, deleteUser, addUser, editUser } from "ActionCreators/UsersActionCreators";
import { RolesState } from "Store/State/RolesState";
import { getRoles } from "ActionCreators/RolesActionCreators";
import { Header } from "./Header";
import {modalBox} from "Components/UX/ModalBox/ModalBox";
import {ConfirmDialog} from "Components/UX/ModalBox/Dialogs/ConfirmDialog";
import {AddUserDialog, AddUserDialogData} from "./Modals/AddUserDialog";

const styles: any = require("./Users.module.sass");

interface IUsersProps {
	getUsers?: () => Promise<{}>;
	users?: UsersState;
	getRoles?: () => Promise<{}>;
	deleteUser?: (id: Server.ObjectId) => Promise<{}>;
	addUser?: (data: Server.AddUser) => Promise<{}>;
	editUser?: (id: Server.ObjectId, data: Server.AddUser) => Promise<{}>;
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

	private onAddUser(): void {
		modalBox.show(
			`Добавить пользователя`,
			AddUserDialog,
			{
				surname: "",
				name: "",
				middleName: "",
				roleId: null,
				birthday: null,
				birthPlace: "",
				email: "",
				phoneNumber: "",
				roles: this.props.roles.items
			},
			null,
			{
				okBtnCaption: "Добавить"
			}
		).then((value: AddUserDialogData) => {
			this.props.addUser(value)
			.then(() => {
				this.props.getUsers();
			})
			.catch(() => {})
		}).catch(() => {})
	}

	private onEditUser(user: Server.User): void {
		const birthday = moment().date(user.birthday).locale("ru").format("DD.MM.YYYY");
		const registerDate = moment().date(user.registerDate).locale("ru").format("DD.MM.YYYY HH:mm:ss");
		const lastUpdate = moment().date(user.lastUpdate).locale("ru").format("DD.MM.YYYY HH:mm:ss");
		modalBox.show(
			`Редактировать пользователя`,
			AddUserDialog,
			{
				surname: user.surname,
				name: user.name,
				middleName: user.middleName,
				roleId: user.role.id,
				birthday: birthday,
				birthPlace: user.birthPlace,
				email: user.email,
				phoneNumber: (user.phoneNumber || "").replace(/[^+\d]/g, ''),
				registerDate: registerDate,
				lastUpdate: lastUpdate,
				roles: this.props.roles.items
			},
			null,
			{
				okBtnCaption: "Сохранить"
			}
		).then((value: AddUserDialogData) => {
			this.props.editUser(user.id, value)
				.then(() => {
					this.props.getUsers();
				})
				.catch(() => {})
		}).catch(() => {})
	}

	private renderHeader(): JSX.Element {
		return (
			<Header
				title={"Пользователи"}
				buttonCaption={"Добавить нового пользователя"}
				onButtonClick={() => this.onAddUser()}
			/>
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
				{this.renderTableHeader()}
				{this.renderTableBody()}
			</div>
		);
	}

	private renderTableHeader(): JSX.Element {
		return (
			<div className={styles['users__table-header']}>
				<div className={classNames(styles['users__table-col'], styles['_col_num'])}>
					№
				</div>
				<div className={classNames(styles['users__table-col'], styles['_col_name'])}>
					ФИО пользователя
				</div>
				<div className={classNames(styles['users__table-col'])}>
					Роль
				</div>
				<div className={classNames(styles['users__table-col'], styles['_col_birth-date'])}>
					Дата рождения
				</div>
				<div className={classNames(styles['users__table-col'])}>
					Место рождения
				</div>
				<div className={classNames(styles['users__table-col'])}>
					Почта
				</div>
				<div className={classNames(styles['users__table-col'], styles['_col_phone'])}>
					Телефон
				</div>
				<div className={classNames(styles['users__table-col'], styles['_col_date'])}>
					Регистрация
				</div>
				<div className={classNames(styles['users__table-col'], styles['_col_date'])}>
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
				const fio1 = Tools.getFIO(item1.surname, item1.name, item1.middleName);
				const fio2 = Tools.getFIO(item2.surname, item2.name, item2.middleName);
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
				const fio = Tools.getFIO(user.surname, user.name, user.middleName);
				items.push(
					<div className={styles['users__table-row']} key={index}>
						<div className={classNames(styles['users__table-col'], styles['_col_num'])}>
							<div className={styles['users__table-col-inner']}>
								{index + 1}
							</div>
						</div>
						<div className={classNames(styles['users__table-col'], styles['_col_name'])}>
							<div className={styles['users__table-col-inner']}>
								{fio}
							</div>
						</div>
						<div className={classNames(styles['users__table-col'])}>
							<div className={styles['users__table-col-inner']}>
								{user.role ? user.role.title : ""}
							</div>
						</div>
						<div className={classNames(styles['users__table-col'], styles['_col_birth-date'])}>
							<div className={styles['users__table-col-inner']}>
								{
									user.birthday &&
									<Moment format={'DD.MM.YYYY'} locale="ru" date={user.birthday} />
								}
							</div>
						</div>
						<div className={classNames(styles['users__table-col'])}>
							<div className={styles['users__table-col-inner']}>
								{user.birthPlace}
							</div>
						</div>
						<div className={classNames(styles['users__table-col'])}>
							<div className={styles['users__table-col-inner']}>
								{user.email}
							</div>
						</div>
						<div className={classNames(styles['users__table-col'], styles['_col_phone'])}>
							<div className={styles['users__table-col-inner']}>
								{
									user.phoneNumber &&
									Tools.formatPhoneNumber(user.phoneNumber, PhoneNumberFormat.INTERNATIONAL)
								}
							</div>
						</div>
						<div className={classNames(styles['users__table-col'], styles['_col_date'])}>
							<div className={styles['users__table-col-inner']}>
								<Moment format={'DD.MM.YYYY'} locale="ru" date={user.registerDate} />
							</div>
						</div>
						<div className={classNames(styles['users__table-col'], styles['_col_date'])}>
							<div className={styles['users__table-col-inner']}>
								<Moment format={'DD.MM.YY'} locale="ru" date={user.lastUpdate} />
							</div>
						</div>
						<div className={classNames(styles['users__table-col'], styles['_col_edit'])}>
							<div
								className={classNames(styles['users__table-btn'], styles['_icon_edit'])}
								onClick={() => this.onEditUser(user)}
							/>
						</div>
						<div className={classNames(styles['users__table-col'], styles['_col_delete'])}>
							<div
								className={classNames(styles['users__table-btn'], styles['_icon_delete'])}
								onClick={() => {
									modalBox.show(
										`Подтвердите действие`,
										ConfirmDialog,
										`Вы уверены, что хотите удалить пользователя <strong>${fio}</strong>?`,
										null, {
											okBtnCaption: "Удалить"
										}
									).then(() => {
										this.props.deleteUser(user.id)
											.then(() => {
												this.props.getUsers();
											})
											.catch(() => {})
									}).catch(() => {})
								}}
							/>
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

		return (
			<div>
				<section className={styles['users']}>
					{this.renderHeader()}
					<div className={styles['users__inner']}>
						{
							this.props.users.items.length ?
							<div>
								{this.renderToolbar()}
								{this.renderTable()}
							</div> :
							<div className={styles['users__empty']}>
								Нет пользователей
							</div>
						}
					</div>
				</section>
			</div>
		);
	}
}

function mapStateToProps(state: StoreState): IUsersProps {
	return {
		users: state.users,
		roles: state.roles
	}
}

// TODO: исправить ошибку в типизации function mapDispatchToProps(dispatch: Dispatch<{}>): IUsersProps {
function mapDispatchToProps(dispatch: any): IUsersProps {
	return {
		getUsers: () => dispatch(getUsers()),
		getRoles: () => dispatch(getRoles()),
		changeSortOrder: () => dispatch(changeSortOrder()),
		deleteUser: (id) => dispatch(deleteUser(id)),
		addUser: (data) => dispatch(addUser(data)),
		editUser: (id, data) => dispatch(editUser(id, data))
	};
}