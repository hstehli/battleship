import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

// NOTATION: N'oubliez pas d'écrire des tests !

//test si il y a bien 5 bateaux
// it('affiche 5 bateaux', () => {
// 	const wrapper = mount(<App />);
// 	expect(wrapper.find('line').length).toEqual(5);
// });
