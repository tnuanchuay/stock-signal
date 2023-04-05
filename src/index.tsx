import React from 'react';
import { createRoot } from 'react-dom/client';
import { render } from 'react-dom';
import { App } from './app';


const element = document.getElementById('root');
const root = createRoot(element!);

root.render(
    App,
);