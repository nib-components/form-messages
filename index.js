var emitter = require("emitter");

/**
 * Get the difference between two arrays
 * @param  {Array} arr
 * @param  {Array} arr2
 * @return {Array}
 */
function difference(arr, arr2) {
  return arr.filter(function(val) {
    return arr2.indexOf(val) > -1;
  })
}

/**
 * Remove an element from an array
 * @param  {Mixed} val
 * @param  {Array} arr
 * @return {Array}
 */
function remove(val, arr) {
  return arr.filter(function(val2) {
    return val !== val2;
  });
}

/**
 * Create a new Messages object and give it a
 * form element. Then just pass objects of messages
 * and they will be shown and hidden as needed
 *
 * @param {Element} el Will show messages within this el
 */
function Messages(el) {
  this.el = el;
  this._visible = [];
}

emitter(Messages.prototype);

/**
 * Is a message currently visible
 * @param  {String} name
 * @return {Boolean}
 */
Messages.prototype.isVisible = function(name) {
  return this._visible.indexOf(name) > -1;
};

/**
 * Get the difference between a messages object and
 * the currently visible messages. Returns the names
 * of the messages that are not in the messages list
 * and can be removed.
 *
 * @param  {Array} name
 * @return {Array}
 */
Messages.prototype.getDifference = function(names) {
  return difference(this._visible, names);
};

/**
 * Show an object of messages. Keys are the field
 * names and the values are the messages. Any current
 * messages that are visible that aren't in this list
 * will be removed.
 *
 * @param  {Object} messages
 * @return {void}
 */
Messages.prototype.showAll = function(messages) {
  var names = Object.keys(messages);
  this.getDifference(names).forEach(this.remove, this);
  names.forEach(function(name) {
    self.show(name, messages[name]);
  }, this);
};

/**
 * Show a single message
 * @param  {String} name
 * @param  {String} message
 * @return {void}
 */
Messages.prototype.show = function(name, message) {
  var el = this.field(name) || this.el;
  if( this.isVisible(name) ) {
    self.emit('update', name, message);
  }
  else {
    this.emit('show', el, name, message);
    this._visible.push(name);
  }
};

/**
 * Remove a single message
 * @param  {String} name
 * @return {void}
 */
Messages.prototype.remove = function(name){
  if( !this.isVisible(name) ) return;
  this.emit('hide', name);
  this._visible = remove(name, this._visible);
};

/**
 * Remove all the messages
 * @return {void}
 */
Messages.prototype.removeAll = function() {
  this._visible.slice().forEach(this.remove, this);
};

/**
 * Get the element for a message by using the name
 * @param  {String} name
 * @return {Element}
 */
Messages.prototype.field = function(name) {
  return this.el.querySelector('[data-message-for="'+name+'"], [name="'+name+'"]');
};

module.exports = Messages;