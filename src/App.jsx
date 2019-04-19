import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.scss';

import Feeling from './Feeling';

import feelingJSON from './feelings.json';


function copyToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}


class App extends Component {
  constructor() {
    super();

    this.state = {
      availableFeelings: ['good', 'bad'],
      feelingData: JSON.parse(feelingJSON),
      selectedFeelings: new Set(),
      removedFeelings: new Set(),
      feelingIntensities: new Map(),
    };
    this.openFeeling = this.openFeeling.bind(this);
    this.closeFeeling = this.closeFeeling.bind(this);
    this.goToStart = this.goToStart.bind(this);
    this.shareFeelings = this.shareFeelings.bind(this);
    this.resetFeelings = this.resetFeelings.bind(this);
    this.updateFeelingIntensity = this.updateFeelingIntensity.bind(this);
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
      feelingIntensities: new Map()
    });
  }

  shareFeelings() {
    const { selectedFeelings, feelingIntensities } = this.state;
    const feelingsToShare = [...selectedFeelings].map(selectedFeeling => {
      const feelingIntensity = feelingIntensities.get(selectedFeeling)
      return feelingIntensity ? `${selectedFeeling} ${feelingIntensity}` : selectedFeeling;
    }).join(', ');
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
    if (event.target.className === 'feeling-slider') return;

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

  updateFeelingIntensity(feeling, intensity) {
    this.setState(prevState => {
      let newIntensities = prevState.feelingIntensities;
      newIntensities.set(feeling, intensity);
      console.log(newIntensities)
      return {
        feelingIntensities: newIntensities
      }
    })
  }

  render() {
    const {
      availableFeelings, feelingData, removedFeelings, selectedFeelings, feelingIntensities
    } = this.state;

    const {updateFeelingIntensity} = this;

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

    const filteredFeelings = availableFeelings.filter(feeling => !feelingToShow(feeling));


    const feelingsJSX = filteredFeelings.map((feeling, index) => <Feeling index={index} key={index} name={feeling} openFeeling={this.openFeeling} subfeelings={feelingData[feeling] || false} intensity={feelingIntensities.get(feeling) || 5} updateIntensity={updateFeelingIntensity} closeFeeling={this.closeFeeling} />);

    const selectedFeelingsString = [...selectedFeelings].map(feeling => <span className="selected-feeling">{feeling} {feelingIntensities.get(feeling)}</span>);

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
