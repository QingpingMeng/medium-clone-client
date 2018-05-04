import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AuthStore } from '../../stores/authStore';
import CenterPaper from '../Shared/CenterPaper';
import LinkButton from '../Shared/LinkButton';

interface InjectedProps {
    authStore: AuthStore;
}

@inject('authStore')
@observer
export default class Register extends React.Component<{}, {}> {
    public get injectedProps() {
        return this.props as InjectedProps;
    }

    public get routeProps() {
        return this.props as RouteComponentProps<{}>;
    }
    public render() {
        const { values, errors, inProgress } = this.injectedProps.authStore;
        return (
            <div style={{ flexGrow: 1, marginTop: '1.125rem' }}>
                <CenterPaper>
                    <Typography
                        variant="headline"
                        align="center"
                        component="h1"
                    >
                        Sign up
                    </Typography>
                    <div className="center">
                        <LinkButton to="/login">Have an account?</LinkButton>
                    </div>
                    <form
                        onSubmit={this.handleSubmitForm}
                        className="center"
                        style={{ width: '50%', margin: 'auto' }}
                    >
                        <TextField
                            id="username"
                            label="Username"
                            value={values.username}
                            error={Boolean(errors && errors.username)}
                            fullWidth={true}
                            required={true}
                            helperText={errors && errors.username && errors.username.join(';')}
                            FormHelperTextProps={{
                                error: Boolean(errors && errors.username)
                            }}
                            onChange={this.handleChange('username')}
                            margin="normal"
                        />
                        <TextField
                            id="email"
                            label="Email"
                            required={true}
                            value={values.email}
                            error={Boolean(errors && errors.email)}
                            fullWidth={true}
                            type="email"
                            helperText={errors && errors.email && errors.email.join(';')}
                            onChange={this.handleChange('email')}
                            margin="normal"
                        />
                        <TextField
                            id="password"
                            error={Boolean(errors && errors.password)}
                            fullWidth={true}
                            label="Password"
                            required={true}
                            value={values.password}
                            helperText={errors && errors.password && errors.password.join(';')}
                            type="password"
                            onChange={this.handleChange('password')}
                            margin="normal"
                        />

                        <Button
                            color="primary"
                            type="submit"
                            variant="raised"
                            disabled={inProgress}
                        >
                            {inProgress && (
                                <CircularProgress size={20} color="secondary" />
                            )}Sign in
                        </Button>
                    </form>
                </CenterPaper>
            </div>
        );
    }

    private handleChange = (propName: 'password' | 'email' | 'username') => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        this.injectedProps.authStore.setValue(propName, event.target.value);
    };

    private handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.injectedProps.authStore
            .register()
            .then(() => this.routeProps.history.replace('/'));
    };
}
