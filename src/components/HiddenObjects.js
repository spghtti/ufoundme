import React from 'react';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const HiddenObjects = (props) => {
  const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
  };

  const images = importAll(
    require.context('../images/objects', false, /\.(png|jpe?g|svg)$/)
  );

  const objectArray = [
    {
      name: 'Stand mixer',
      value: 'mixer',
      image: 'mixer',
      link: '../images/mixer',
      isFound: false,
    },
    {
      name: 'Tropical bird',
      value: 'bird',
      image: 'bird',
      link: '../images/bird',
      isFound: false,
    },
    {
      name: 'Golden egg',
      value: 'egg',
      image: 'egg',
      link: '../images/egg',
      isFound: false,
    },
  ];

  const checkAccuracy = (guessArray, answerArray) => {
    const xDiff = Math.abs((answerArray[0] - guessArray[0]) / guessArray[0]);
    const yDiff = Math.abs((answerArray[1] - guessArray[1]) / guessArray[1]);
    if (xDiff < 0.103 && yDiff < 0.036) {
      return true;
    }
    return false;
  };

  async function checkGuess(value, coords) {
    const intCoords = [Number(coords[0]), Number(coords[1])];
    console.log(`${value} => ${intCoords}`);
    const docRef = doc(db, 'locations', `${value}`);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data().location);
    console.log(checkAccuracy(intCoords, docSnap.data().location));
  }

  const hideMenu = () => {
    const menu = document.getElementById('target');
    const dropdown = document.getElementById('dropdown-menu');
    menu.style.visibility = 'hidden';
    dropdown.style.visibility = 'hidden';
    props.setHasClicked(true);
  };

  const handleSelection = (event) => {
    checkGuess(event.target.attributes.value.value, props.coords);
    hideMenu();
  };

  return (
    <div className="hidden-object-list">
      {objectArray.map((object, index) => (
        <div
          key={index}
          className="hidden-object-list-item"
          onClick={handleSelection}
          value={object.value}
        >
          <div className="hidden-object-list-item-icon-container">
            <img
              className="hidden-object-list-item-icon"
              src={images[`${object.image}.png`]}
              alt=""
              value={object.value}
            />
          </div>
          <div className="hidden-object-list-item-name" value={object.value}>
            {object.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HiddenObjects;
