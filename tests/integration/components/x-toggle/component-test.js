import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import emberVersionGTE from 'ember-test-helpers/has-ember-version';

moduleForComponent('x-toggle', 'Integration | Component | x toggle', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{x-toggle}}`);

  assert.equal(this.$().find('div.x-toggle-btn').length, 1);
});

test('changing disabled property disables component', function(assert) {
  this.set('disabled', true);
  this.set('value', false);
  this.render(hbs`{{x-toggle
    value=value
    disabled=disabled
  }}`);
  assert.equal($('input.x-toggle').prop('disabled'), true);
  assert.equal(this.get('value'), false);
  this.$('div.x-toggle-btn').click();
  assert.equal($('input.x-toggle').prop('disabled'), true);
  assert.equal(this.get('value'), false);
});

test('clicking component triggers onToggle action', function(assert) {
  const done = assert.async();
  this.set('myValue', false);
  this.on('onToggle', val => {
    assert.equal(val, true, 'new value set');

    this.set('completed', true);
    done();
  });
  this.render(hbs`{{x-toggle
    value=myValue
    onToggle=(action 'onToggle')
  }}`);
  this.$('div.x-toggle-btn').click();

  setTimeout(() => {
    if(!this.get('completed')) {
      assert.equal(true, false, 'timed out waiting for toggle event');
      done();
    }
  }, 1000);
});

test('clicking component labels triggers onToggle action', function(assert) {
  let onTrue = true;

  this.set('value', false);
  this.set('onToggle', val => {
    assert.equal(val, onTrue, 'new value set');
    onTrue = false;
    this.set('value', val);
  });

  this.render(hbs`{{x-toggle
    value=value
    showLabels=true
    onToggle=(action onToggle)
  }}`);

  this.$('.on-label').click();
  assert.equal(this.get('value'), true, 'clicking on label toggles value true');

  this.$('.off-label').click();
  assert.equal(this.get('value'), false, 'clicking off label toggles value to false');
});

if (emberVersionGTE(2,0)) {
  test('clicking component works with bespoke values and mut helper', function(assert) {
    this.set('value', false);
    this.render(hbs`{{x-toggle
      value=value
      offLabel='Foo'
      onLabel='Bar'
      showLabels=true
      onToggle=(action (mut value))
    }}`);
    assert.equal(this.get('value'), false);
    assert.equal(this.$('.off-label').text().trim(), 'Foo', '"off" property set on toggle');
    assert.equal(this.$('.on-label').text().trim(), 'Bar', '"on" property set on toggle');
    this.$('div.x-toggle-btn').click();
    assert.equal(this.get('value'), true, 'click toggles value');
  });

  test('clicking component works with boolean true/false', function(assert) {
    this.set('value', false);
    this.render(hbs`{{x-toggle
      value=value
      onToggle=(action (mut value))
      onLabel=true
      offLabel=false
    }}`);
    assert.equal(this.get('value'), false);
    this.$('div.x-toggle-btn').click();
    assert.equal(this.get('value'), true);
  });

  test('clicking component works with boolean true/false and discrete labels', function(assert) {
    this.set('value', false);
    this.render(hbs`{{x-toggle
      value=value
      onToggle=(action (mut value))
      onLabel='Yes'
      offLabel='No'
    }}`);
    assert.equal(this.get('value'), false);
    this.$('div.x-toggle-btn').click();
    assert.equal(this.get('value'), true);
  });

  test('value can be set by changing the value property', function(assert) {
    this.set('value', false);
    this.set('show', false);

    this.render(hbs`
      {{x-toggle value=value onToggle=(action (mut value))}}
    `);

    this.set('value', true);
    assert.equal(this.$('.x-toggle-container').hasClass('x-toggle-container-checked'), true);

    this.set('value', false);
    assert.equal(this.$('.x-toggle-container').hasClass('x-toggle-container-checked'), false);
  });
}
