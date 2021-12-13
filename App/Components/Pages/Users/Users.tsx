import * as React from "react";
import * as Server from "Models/ServerInterfaces";

import classNames from "classnames";

import { connect } from "react-redux";

import { CustomPage } from "Components/CustomPage";
import { Dispatch } from "redux";
import { Loading } from "Components/Common/Loading/Loading";
import { StoreState } from "Store/StoreState";
import { UsersState } from "Store/State/UsersState";
import { getUsers } from "ActionCreators/UsersActionCreators";
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
}

interface IUsersItem
{
	title?: string;
	items: string[];
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

	renderHeader(): JSX.Element {
		return (
			<Header title={"Пользователи"} buttonCaption={"Добавить нового пользователя"}/>
		);
	}

	renderItems(): JSX.Element {
		let items: JSX.Element[] = [];

		this.props.users.items
			.sort((item1, item2) => {
				return item1.surname < item2.surname ? 1 : -1;
			})
			.forEach((user: Server.User, index: number) => {
				items.push(
					<div className={styles['users__item']} key={index}>
						{user.surname}
					</div>
				);
			});

		return (
			<div className={styles['users__list']}>
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
			<section className={ styles['users'] }>
				{this.renderHeader()}
				{this.renderItems()}
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
	};
}