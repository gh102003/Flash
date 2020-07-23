import React from "react";

export class QuizTimer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timeElapsed: 0,
            isFinished: false,
            startTime: null
        };
    }

    componentDidMount() {
        // Start interval on mount, but only update the timer if running
        this.timerHandle = setInterval(
            () => { if (this.props.running) { this.tick(); } },
            100
        );
    }

    componentWillUnmount() {
        if (!this.state.isFinished) {
            clearInterval(this.timerHandle);
        }
    }

    componentDidUpdate(prevProps) {
        // If running changes to true, set the start time
        if (prevProps.running === false && this.props.running === true) {
            this.setState({ startTime: new Date() });
        }
    }

    tick() {
        this.setState(oldState => {
            let timeElapsed = new Date() - oldState.startTime;

            if (timeElapsed >= this.props.length) {
                clearInterval(this.timerHandle);
                this.props.onFinish();
                return {
                    timeElapsed: this.props.length,
                    isFinished: true
                };
            } else {
                return {
                    timeElapsed
                };
            }
        });
    }

    render() {
        let timeLeft = this.props.length - this.state.timeElapsed;

        let styles = { color: "inherit" };
        if (timeLeft < 10000 && timeLeft % 1000 < 500) {
            styles.color = "crimson";
        }

        let timeLeftFormatted = (Math.round(timeLeft / 100) / 10).toFixed(1) + "s";
        let digits = [...timeLeftFormatted];

        return (
            <div className="quiz-timer" style={styles}>
                {digits.map((digit, idx) => <span key={idx}>{digit}</span>)}
            </div>
        );
    }
}