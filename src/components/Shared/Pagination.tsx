import { IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import * as React from 'react';

const calculateRange = (arg: {
    total: number;
    current: number;
    display: number;
}) => {
    const { total, current, display } = arg;
    let end = total;
    let start = 1;
    if (display < end) {
        // rounded to the nearest integer smaller
        let beforeNumber = Math.round(display / 2 - 0.5);
        const afterNumber = beforeNumber;
        if (display % 2 === 0) {
            beforeNumber -= 1;
        }

        if (current <= beforeNumber + 1) {
            end = display;
        } else if (current >= total - afterNumber) {
            start = total - display + 1;
        } else {
            start = current - beforeNumber;
            end = current + afterNumber;
        }
    }

    return { end, start };
};

const getStateFromProps = (props: IPaginationProps) => {
    let { total, current, display } = props;
    total = total > 0 ? total : 1;
    current = current > 0 ? current : 1;
    display = display > 0 ? display : 1;
    current = current < total ? current : total;
    display = display < total ? display : total;
    return { current, display, total };
};

const Page = ({
    value,
    isActive,
    onClick
}: {
    value: number;
    isActive: boolean;
    onClick: any;
}) => {
    return (
        <Button
            variant="fab"
            mini={true}
            color={isActive ? 'secondary' : 'default'}
            onClick={onClick}
        >
            {value.toString()}
        </Button>
    );
};

const FirstPageLink = ({ onClick }: { onClick: any }) => {
    return (
        <IconButton aria-label="First page" onClick={onClick}>
            <FirstPageIcon color="default" />
        </IconButton>
    );
};

const LastPageLink = ({ onClick }: { onClick: any }) => {
    return (
        <IconButton aria-label="Last page" onClick={onClick}>
            <LastPageIcon color="default" />
        </IconButton>
    );
};

interface IPaginationProps {
    total: number;
    current: number;
    display: number;
    onChange: (page: number) => void;
    styleRoot?: React.CSSProperties;
}

interface IPaginationState {
    current: number;
    display: number;
    total: number;
    start: number;
    end: number;
}

export default class Pagination extends React.Component<
    IPaginationProps,
    IPaginationState
> {
    constructor(props: IPaginationProps) {
        super(props);

        const tem = getStateFromProps(props);

        this.state = {
            ...tem,
            ...calculateRange(tem)
        };
    }

    public componentWillReceiveProps(nextProps: IPaginationProps) {
        const tem = getStateFromProps(nextProps);
        this.setState({
            ...tem,
            ...calculateRange(tem)
        });
    }

    public render() {
        const array = [];
        for (let i = this.state.start; i <= this.state.end; i += 1) {
            array.push(i);
        }

        return (
            <div style={this.props.styleRoot}>
                <FirstPageLink onClick={this.setCurrent(1)} />
                {array.map((page, k) => (
                    <Page
                        key={k}
                        value={page}
                        isActive={this.state.current === page}
                        onClick={this.setCurrent(page)}
                    />
                ))}
                <LastPageLink onClick={this.setCurrent(this.state.total)} />
            </div>
        );
    }

    private setCurrent = (current: number) => (e: any) => {
        const tem = { ...this.state, current };
        this.props.onChange(current);
        this.setState({
            ...tem,
            ...calculateRange(tem)
        });
    };
}
