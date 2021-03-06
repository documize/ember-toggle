import Component from '@ember/component';
import { computed } from '@ember/object';
import { next } from '@ember/runloop';
import layout from './template';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

export default Component.extend(RecognizerMixin, {
  layout,
  tagName: 'span',
  classNames: ['x-toggle-container'],
  classNameBindings: [
    'size', 
    'disabled:x-toggle-container-disabled',
    'value:x-toggle-container-checked'
  ],

  labelDisabled: false,
  recognizers: 'pan',

  effectiveForId: computed('forId', 'labelDisabled', function() {
    return this.get('labelDisabled') ? null : this.get('forId');
  }),

  themeClass: computed('theme', function() {
    let theme = this.get('theme') || 'default';
    
    return `x-toggle-${theme}`;
  }),

  keyPress(event) {
    // spacebar: 32
    if (event.which === 32) {
      let value = this.get('value');

      this.sendToggle(!value);
      event.preventDefault();
    }
  },

  panRight() {
    if (this.get('disabled')) {
      return;
    }

    this.get('sendToggle')(true);
    this._disableLabelUntilMouseUp();
  },

  panLeft() {
    if (this.get('disabled')) {
      return;
    }

    this.get('sendToggle')(false);
    this._disableLabelUntilMouseUp();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._removeListener();
  },

  /*
    When you pan with a mouse and release the mouse button over the <label>
    element, a click event happens and returns the toggle to its initial
    state. :(

    To prevent this, we need to make the label non-functional until after the
    mouse button is released.
   */
  _disableLabelUntilMouseUp() {
    if (this.get('labelDisabled')) {
      return;
    }

    const _listener = () => {
      next(() => {
        if (this.get('isDestroying') || this.get('isDestroyed')) {
          return;
        }

        this._removeListener()
        this.set('labelDisabled', false);
      });
    };

    this.setProperties({
      labelDisabled: true,
      _listener
    });

    document.addEventListener('mouseup', _listener);
  },

  _removeListener() {
    const _listener = this.get('_listener');

    if (_listener) {
      document.removeEventListener('mouseup', _listener);
      this.set('_listener', null);
    }
  }
});
