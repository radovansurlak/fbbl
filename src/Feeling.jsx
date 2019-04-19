import React, { Component } from 'react';

export default class Feeling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: undefined,
    } 
    this.getRandomFlatColor = this.getRandomFlatColor.bind(this);
  }


  componentDidMount() {
    const { getRandomFlatColor } = this;
    this.setState({
      color: getRandomFlatColor(),
    });
  }

  getRandomFlatColor() {
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



  render() {
    const {
      closeFeeling, openFeeling, updateIntensity, subfeelings, name, index, intensity
    } = this.props;
    const { color } = this.state;

    const style = {
      backgroundColor: color,
    };

    return (
      <div tabIndex={0} role="button" style={style} key={index} onClick={event => openFeeling(event, name, subfeelings)} className="feeling">
        {/* <button type="button" onClick={event => closeFeeling(event, name)} className="feeling__close-button">╳</button> */}
        <span className="feeling-intensity">{intensity}</span>
        <input onChange={event => updateIntensity(name, event.target.value)} type="range" min="1" max="10" value={intensity} className="slider feeling-slider" />
        <span className="feeling__label">{name}</span>
      </div>
    );
  }
}
