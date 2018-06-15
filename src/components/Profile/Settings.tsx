import { IconButton, Snackbar } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { emptyUser, IUser } from '../../models/User.model';
import { UserStore } from '../../stores/userStore';
import CenterPaper from '../Shared/CenterPaper';

interface IInjectedSettingsFormProps {
    userStore: UserStore;
}

interface ISettingsFormState {
    image: string;
    username: string;
    bio: string;
    email: string;
    password: string;
    showSnackbar: boolean;
    snackbarMessage: string;
}

@inject('userStore')
@observer
export default class SettingsForm extends React.Component<
    any,
    ISettingsFormState
> {
    constructor(props: IInjectedSettingsFormProps) {
        super(props);
        this.state = {
            bio: '',
            email: '',
            image: '',
            password: '',
            showSnackbar: false,
            snackbarMessage: '',
            username: ''
        };
    }

    get injectedProps() {
        return this.props as IInjectedSettingsFormProps;
    }

    public componentWillMount() {
        const { currentUser } = this.injectedProps.userStore;
        if (currentUser) {
            this.setState({
                bio: currentUser.bio || '',
                email: currentUser.email,
                image: currentUser.image || '',
                username: currentUser.username
            });
        }
    }

    public render() {
        const {
            updatingUserErrors: errors,
            updatingUser: inProgress
        } = this.injectedProps.userStore;

        return (
            <CenterPaper>
                <Typography variant="headline" align="center" component="h1">
                    Your settings
                </Typography>
                <CenterPaper>
                    <form onSubmit={this.submitForm}>
                        <TextField
                            label="profile picture"
                            value={this.state.image}
                            error={Boolean(errors && errors.image)}
                            fullWidth={true}
                            placeholder="URL of profile picture"
                            type="text"
                            helperText={
                                errors && errors.image && errors.image.join(';')
                            }
                            onChange={this.updateState('image')}
                            margin="normal"
                        />
                        <TextField
                            label="username"
                            value={this.state.username}
                            error={Boolean(errors && errors.username)}
                            fullWidth={true}
                            type="text"
                            helperText={
                                errors &&
                                errors.username &&
                                errors.username.join(';')
                            }
                            onChange={this.updateState('username')}
                            margin="normal"
                        />
                        <TextField
                            label="bio"
                            value={this.state.bio}
                            error={Boolean(errors && errors.bio)}
                            fullWidth={true}
                            type="text"
                            multiline={true}
                            placeholder="short bio about you"
                            helperText={
                                errors && errors.bio && errors.bio.join(';')
                            }
                            onChange={this.updateState('bio')}
                            margin="normal"
                        />
                        <TextField
                            label="email"
                            value={this.state.email}
                            error={Boolean(errors && errors.email)}
                            fullWidth={true}
                            type="email"
                            helperText={
                                errors && errors.email && errors.email.join(';')
                            }
                            onChange={this.updateState('email')}
                            margin="normal"
                        />
                        <TextField
                            label="password"
                            value={this.state.password}
                            error={Boolean(errors && errors.password)}
                            fullWidth={true}
                            type="password"
                            helperText={
                                errors &&
                                errors.password &&
                                errors.password.join(';')
                            }
                            onChange={this.updateState('username')}
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
                            )}Update
                        </Button>
                    </form>
                </CenterPaper>
                <Snackbar
                    onClose={this.handleCloseSnackbar}
                    open={this.state.showSnackbar}
                    autoHideDuration={4000}
                    anchorOrigin={{
                        horizontal: 'right',
                        vertical: 'top'
                    }}
                    message={<span>{this.state.snackbarMessage}</span>}
                    action={[
                        <IconButton
                          key="close"
                          aria-label="Close"
                          color="inherit"
                          onClick={this.handleCloseSnackbar}
                        >
                          <CloseIcon />
                        </IconButton>,
                      ]}
                />
            </CenterPaper>
        );
    }

    private updateState = (field: string) => (
        ev: React.ChangeEvent<HTMLInputElement>
    ) => {
        const state = this.state;
        const newState = Object.assign({}, state, { [field]: ev.target.value });
        this.setState(newState);
    };

    private submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = Object.assign(emptyUser(), this.state) as IUser;

        if (!user.password) {
            delete user.password;
        }

        this.injectedProps.userStore
            .updateUser(user)
            .then(() => {
                this.injectedProps.userStore.pullUser();
                this.setState({
                    showSnackbar: true,
                    snackbarMessage: 'Update completed'
                });
            })
            .catch(() => {
                this.setState({
                    showSnackbar: true,
                    snackbarMessage: 'Update failed'
                });
            });
    };

    private handleCloseSnackbar = () => {
        this.setState({
            showSnackbar: false
        });
    };
}
