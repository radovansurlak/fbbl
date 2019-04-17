/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.scss';

import feelingJSON from './feelings.json';


function randomFlatColor() {
  const colors = [
    'rgb(26, 188, 156)',
    'rgb(46, 204, 113)',
    'rgb(52, 152, 219)',
    'rgb(155, 89, 182)',
    'rgb(52, 73, 94)',
    'rgb(22, 160, 133)',
    'rgb(39, 174, 96)',
    'rgb(41, 128, 185)',
    'rgb(142, 68, 173)',
    'rgb(44, 62, 80)',
    'rgb(241, 196, 15)',
    'rgb(230, 126, 34)',
    'rgb(231, 76, 60)',
    'rgb(243, 156, 18)',
    'rgb(211, 84, 0)',
    'rgb(192, 57, 43)',

  ];
  return colors[Math.floor(Math.random() * colors.length)];
}


function copyToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}


class Feeling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: undefined,
    };
  }

  componentWillMount() {
    this.setState({
      color: randomFlatColor(),
    });
  }


  render() {
    const {
      closeFeeling, openFeeling, subfeelings, name, index,
    } = this.props;
    const { color } = this.state;

    const style = {
      backgroundColor: color,
    };

    return (
      <div style={style} key={index} onClick={event => openFeeling(event, name, subfeelings)} className="feeling">
        <button type="button" onClick={event => closeFeeling(event, name)} className="feeling__close-button">╳</button>
        <span className="feeling__label">{name}</span>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      availableFeelings: ['good', 'bad'],
      feelingData: JSON.parse(feelingJSON),
      selectedFeelings: new Set(),
      removedFeelings: new Set(),
    };
    this.openFeeling = this.openFeeling.bind(this);
    this.closeFeeling = this.closeFeeling.bind(this);
    this.goToStart = this.goToStart.bind(this);
    this.shareFeelings = this.shareFeelings.bind(this);
    this.resetFeelings = this.resetFeelings.bind(this);
  }

  goToStart() {
    this.setState({
      availableFeelings: ['good', 'bad'],
      feelingData: JSON.parse(feelingJSON),
    });
  }

  resetFeelings() {
    this.setState({
      availableFeelings: ['good', 'bad'],
      feelingData: JSON.parse(feelingJSON),
      selectedFeelings: new Set(),
      removedFeelings: new Set(),
    });
  }

  shareFeelings() {
    const { selectedFeelings } = this.state;
    const feelingsToShare = [...selectedFeelings].join(', ');
    if (navigator.share !== undefined) {
      navigator.share({
        title: 'How I feel...',
        text: feelingsToShare,
      });
    } else {
      copyToClipboard(feelingsToShare);
      alert(feelingsToShare);
    }
  }

  openFeeling(event, feeling, subfeelings) {
    const feelingIndex = this.state.availableFeelings.indexOf(feeling);

    this.setState((prevState) => {
      const newSelectedFeelings = prevState.selectedFeelings;
      newSelectedFeelings.add(feeling);
      return {
        selectedFeelings: newSelectedFeelings,
      };
    });


    this.setState((prevState) => {
      let newFeelings = prevState.availableFeelings;
      newFeelings.splice(feelingIndex, 1);
      newFeelings = subfeelings || newFeelings;
      if (newFeelings.length === 0) {
        this.goToStart();
      }
      return {
        availableFeelings: newFeelings,
      };
    });
  }

  closeFeeling(event, feeling) {
    event.stopPropagation();

    const feelingIndex = this.state.availableFeelings.indexOf(feeling);

    this.setState((prevState) => {
      const newFeelings = prevState.availableFeelings;
      const newRemovedFeelings = prevState.removedFeelings;

      newFeelings.splice(feelingIndex, 1);
      newRemovedFeelings.add(feeling);
      return {
        availableFeelings: newFeelings,
        removedFeelings: newRemovedFeelings,
      };
    });
  }

  render() {
    const {
      availableFeelings, feelingData, removedFeelings, selectedFeelings,
    } = this.state;


    function feelingToShow(feeling) {
      if (feelingData[feeling] && feelingData[feeling].every(subfeeling => [...selectedFeelings].includes(subfeeling))) {
        return true;
      }
      if (selectedFeelings.has(feeling) && !feelingData[feeling]
      ) {
        return true;
      }
      if (removedFeelings.has(feeling)) {
        return true;
      }
    }

    window.feelingData = feelingData;
    window.selectedFeelings = [...selectedFeelings];


    const filteredFeelings = availableFeelings.filter(feeling => !feelingToShow(feeling));


    const feelingsJSX = filteredFeelings.map((feeling, index) => <Feeling index={index} name={feeling} openFeeling={this.openFeeling} subfeelings={feelingData[feeling] || false} closeFeeling={this.closeFeeling} />);

    const selectedFeelingsString = [...selectedFeelings].map(feeling => <span className="selected-feeling">{feeling}</span>);

    return (
      <div className="wrapper">
        <section className="selected-feelings">
          {selectedFeelingsString}
        </section>
        <section className="heading">
          <span className="heading__title">How are you feeling?</span>
        </section>
        <main className="feeling-list">
          {feelingsJSX}
        </main>
        <section className="buttons">
          <button type="button" className="reset-button" onClick={this.resetFeelings}>reset</button>
          <button type="button" className="share-button" onClick={this.shareFeelings}>send</button>
          <button type="button" className="back-button" onClick={this.goToStart}>⬅ back</button>
        </section>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));

export default App;
