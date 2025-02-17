import Joyride from 'react-joyride';

const JoyrideTour = ({ steps, run, setRun }) => {
    return (
        <Joyride
            steps={steps}
            run={run}
            continuous={true}
            scrollToFirstStep={true}
            showSkipButton={true}
            callback={data => {
                if (data.status === 'finished' || data.status === 'skipped') {
                    setRun(false);
                }
            }}
            styles={{
                options: {
                    zIndex: 100,
                }
            }}
        />
    )
};

export default JoyrideTour;