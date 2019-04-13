import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.scss';

const l = console.log;

const feelingData = {
  bad: [
    'sad',
    'hurt',
  ],
  good: [
    'happy',
    'satisfied',
  ],
  sad: [
    'tearful',
    'sorrowful',
    'pained',
    'grief',
    'anguish',
    'desolate',
    'desperate',
    'pessimistic',
    'unhappy',
    'lonely',
    'grieved',
    'mournful',
    'dismayed',
  ],
  hurt: [
    'crushed',
    'tormented',
    'deprived',
    'pained',
    'tortured',
    'dejected',
    'rejected',
    'injured',
    'offended',
    'afflicted',
    'aching',
    'victimized',
    'heartbroken',
    'agonized',
    'appalled',
    'humiliated',
    'wronged',
    'alienated',
  ],
};


function Feeling(props) {
  const {
    closeFeeling, openFeeling, subfeelings, name, index,
  } = props;
  return (
    <div key={index} onClick={event => openFeeling(event, name, subfeelings)} className="feeling">
      {name}
      <button type="button" onClick={event => closeFeeling(event, name)} className="feeling__close-button">x</button>
    </div>
  );
}


class App extends Component {
  constructor() {
    super();

    this.state = {
      availableFeelings: ['good', 'bad'],
      feelingData,
      selectedFeelings: [],
    };
    this.openFeeling = this.openFeeling.bind(this);
    this.closeFeeling = this.closeFeeling.bind(this);
  }

  openFeeling(event, feeling, subfeelings) {
    const feelingIndex = this.state.availableFeelings.indexOf(feeling);

    this.setState((prevState) => {
      const newSelectedFeelings = prevState.selectedFeelings;
      newSelectedFeelings.push(feeling);
      return {
        selectedFeelings: newSelectedFeelings,
      };
    });


    this.setState((prevState) => {
      let newFeelings = prevState.availableFeelings;
      newFeelings.splice(feelingIndex, 1);
      newFeelings = subfeelings ? newFeelings.concat(subfeelings) : newFeelings;
      l(newFeelings);
      return {
        availableFeelings: newFeelings,
      };
    });
  }

  closeFeeling(event, feeling) {
    event.stopPropagation();

    const { availableFeelings } = this.state;
    const feelingIndex = availableFeelings.indexOf(feeling);
    this.setState((prevState) => {
      const newFeelings = prevState.availableFeelings;
      newFeelings.splice(feelingIndex, 1);
      return {
        availableFeelings: newFeelings,
      };
    });
  }

  render() {
    const { availableFeelings, feelingData, selectedFeelings } = this.state;
    const feelingsJSX = availableFeelings.map((feeling, index) => <Feeling index={index} name={feeling} openFeeling={this.openFeeling} subfeelings={feelingData[feeling] || false} closeFeeling={this.closeFeeling} />);
    const selectedFeelingsJSX = selectedFeelings.join(', ');

    return (
      <main>
        <section>
          {feelingsJSX}
        </section>
        <footer className="selected-feelings">
          {selectedFeelingsJSX}
        </footer>
      </main>
    );
  }
}

render(<App />, document.getElementById('root'));

export default App;
