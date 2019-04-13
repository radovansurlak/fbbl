import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.scss';

const l = console.log;

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


const feelingData = {
  bad: [
    'sad',
    'hurt',
    'angry',
    'depressed',
    'confused',
    'helpless',
    'afraid',
    'indifferent',
  ],
  good: [
    'happy',
    'satisfied',
  ],
  afraid: [
    'fearful',
    'terrified',
    'suspicious',
    'anxious',
    'alarmed',
    'panic',
    'nervous',
    'scared',
    'worried',
    'frightened',
    'timid',
    'shaky',
    'restless',
    'doubtful',
    'threatened',
    'cowardly',
    'quaking',
    'menaced',
    'wary',
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
  angry:
    [
      'irritated',
      'enraged',
      'hostile',
      'insulting',
      'sore',
      'annoyed',
      'upset',
      'hateful',
      'unpleasant',
      'offensive',
      'bitter',
      'aggressive',
      'resentful',
      'inflamed',
      'provoked',
      'incensed',
      'infuriated',
      'cross',
      'worked up',
      'boiling',
      'fuming',
      'indignant',
    ],
  depressed:
    [
      'lousy',
      'disappointed',
      'discouraged',
      'ashamed',
      'powerless',
      'diminished',
      'guilty',
      'dissatisfied',
      'miserable',
      'detestable',
      'repugnant',
      'despicable',
      'disgusting',
      'abominable',
      'terrible',
      'in despair',
      'sulky',
      'a sense of loss',
    ],
  helpless: [
    'incapable',
    'alone',
    'paralyzed',
    'fatigued',
    'useless',
    'inferior',
    'vulnerable',
    'empty',
    'forced',
    'hesitant',
    'despair',
    'frustrated',
    'distressed',
    'woeful',
    'pathetic',
    'tragic',
    'in a stew',
    'dominated',
  ],
  indifferent: [
    'insensitive',
    'dull',
    'nonchalant',
    'neutral',
    'reserved',
    'weary',
    'bored',
    'preoccupied',
    'cold',
    'disinterested',
    'lifeless',
  ],

  confused: [
    'doubtful',
    'uncertain',
    'indecisive',
    'perplexed',
    'embarrassed',
    'hesitant',
    'shy',
    'stupefied',
    'disillusioned',
    'unbelieving',
    'skeptical',
    'distrustful',
    'misgiving',
    'lost',
    'unsure',
    'uneasy',
    'pessimistic',
    'tense',
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


class Feeling extends Component {

  constructor(props) {
    super(props);
    this.state = {
      color: props.color
    }
  }

  componentWillMount() {
    this.color = randomFlatColor()
  }

  render() {
    const { closeFeeling, openFeeling, subfeelings, name, index } = this.props;
    const color = this.color;
  
    const style = {
      backgroundColor: color,
    };
    
    return (
      <div style={style} key={index} onClick={event => openFeeling(event, name, subfeelings)} className="feeling">
        <button type="button" onClick={event => closeFeeling(event, name)} className="feeling__close-button">╳</button>
        <span className="feeling__label">{name}</span>
      </div>
    )

  }
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
    this.resetFeelings = this.resetFeelings.bind(this);
  }

  resetFeelings() {
    this.setState({
      availableFeelings: ['good', 'bad']
    })
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
      newFeelings = subfeelings || newFeelings;
      if (newFeelings.length === 0) {
        alert('no more feelings')
        this.resetFeelings();
      }        
      // subfeelings && newFeelings.push(...subfeelings);
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
    const feelingsJSX = availableFeelings.map((feeling, index) => <Feeling index={index} name={feeling} color={randomFlatColor()} openFeeling={this.openFeeling} subfeelings={feelingData[feeling] || false} closeFeeling={this.closeFeeling} />);
    const selectedFeelingsJSX = selectedFeelings.join(', ');

    return (
      <main>
        <section className="selected-feelings">
          {selectedFeelingsJSX}
        </section>
        <section className="feeling-list">
          {feelingsJSX}
        </section>

      </main>
    );
  }
}

render(<App />, document.getElementById('root'));

export default App;
