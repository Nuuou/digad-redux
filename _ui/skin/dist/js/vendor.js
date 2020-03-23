(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendor"],{

/***/ "./node_modules/gsap/Draggable.js":
/*!****************************************!*\
  !*** ./node_modules/gsap/Draggable.js ***!
  \****************************************/
/*! exports provided: Draggable, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Draggable", function() { return Draggable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Draggable; });
/* harmony import */ var _utils_matrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/matrix.js */ "./node_modules/gsap/utils/matrix.js");
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/*!
 * Draggable 3.1.1
 * https://greensock.com
 *
 * @license Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */

/* eslint-disable */


var gsap,
    _win,
    _doc,
    _docElement,
    _body,
    _tempDiv,
    _placeholderDiv,
    _coreInitted,
    _checkPrefix,
    _toArray,
    _supportsPassive,
    _isTouchDevice,
    _touchEventLookup,
    _dragCount,
    _isMultiTouching,
    _isAndroid,
    InertiaPlugin,
    _defaultCursor,
    _supportsPointer,
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _getGSAP = function _getGSAP() {
  return gsap || _windowExists() && (gsap = window.gsap) && gsap.registerPlugin && gsap;
},
    _isFunction = function _isFunction(value) {
  return typeof value === "function";
},
    _isObject = function _isObject(value) {
  return typeof value === "object";
},
    _isUndefined = function _isUndefined(value) {
  return typeof value === "undefined";
},
    _emptyFunc = function _emptyFunc() {
  return false;
},
    _transformProp = "transform",
    _transformOriginProp = "transformOrigin",
    _round = function _round(value) {
  return Math.round(value * 10000) / 10000;
},
    _isArray = Array.isArray,
    _createElement = function _createElement(type, ns) {
  var e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type); //some servers swap in https for http in the namespace which can break things, making "style" inaccessible.

  return e.style ? e : _doc.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://greensock.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
},
    _RAD2DEG = 180 / Math.PI,
    _bigNum = 1e20,
    _identityMatrix = new _utils_matrix_js__WEBPACK_IMPORTED_MODULE_0__["Matrix2D"](),
    _getTime = Date.now || function () {
  return new Date().getTime();
},
    _renderQueue = [],
    _lookup = {},
    //when a Draggable is created, the target gets a unique _gsDragID property that allows gets associated with the Draggable instance for quick lookups in Draggable.get(). This avoids circular references that could cause gc problems.
_lookupCount = 0,
    _clickableTagExp = /^(?:a|input|textarea|button|select)$/i,
    _lastDragTime = 0,
    _temp1 = {},
    // a simple object we reuse and populate (usually x/y properties) to conserve memory and improve performance.
_windowProxy = {},
    //memory/performance optimization - we reuse this object during autoScroll to store window-related bounds/offsets.
_copy = function _copy(obj, factor) {
  var copy = {},
      p;

  for (p in obj) {
    copy[p] = factor ? obj[p] * factor : obj[p];
  }

  return copy;
},
    _extend = function _extend(obj, defaults) {
  for (var p in defaults) {
    if (!(p in obj)) {
      obj[p] = defaults[p];
    }
  }

  return obj;
},
    _renderQueueTick = function _renderQueueTick() {
  return _renderQueue.forEach(function (func) {
    return func();
  });
},
    _addToRenderQueue = function _addToRenderQueue(func) {
  _renderQueue.push(func);

  if (_renderQueue.length === 1) {
    gsap.ticker.add(_renderQueueTick);
  }
},
    _renderQueueTimeout = function _renderQueueTimeout() {
  return !_renderQueue.length && gsap.ticker.remove(_renderQueueTick);
},
    _removeFromRenderQueue = function _removeFromRenderQueue(func) {
  var i = _renderQueue.length;

  while (i--) {
    if (_renderQueue[i] === func) {
      _renderQueue.splice(i, 1);
    }
  }

  gsap.to(_renderQueueTimeout, {
    overwrite: true,
    delay: 15,
    duration: 0,
    onComplete: _renderQueueTimeout,
    data: "_draggable"
  }); //remove the "tick" listener only after the render queue is empty for 15 seconds (to improve performance). Adding/removing it constantly for every click/touch wouldn't deliver optimal speed, and we also don't want the ticker to keep calling the render method when things are idle for long periods of time (we want to improve battery life on mobile devices).
},
    _setDefaults = function _setDefaults(obj, defaults) {
  for (var p in defaults) {
    if (!(p in obj)) {
      obj[p] = defaults[p];
    }
  }

  return obj;
},
    _addListener = function _addListener(element, type, func, capture) {
  if (element.addEventListener) {
    var touchType = _touchEventLookup[type];
    capture = capture || (_supportsPassive ? {
      passive: false
    } : null);
    element.addEventListener(touchType || type, func, capture);

    if (touchType && type !== touchType && touchType.substr(0, 7) !== "pointer") {
      //some browsers actually support both, so must we. But pointer events cover all.
      element.addEventListener(type, func, capture);
    }
  }
},
    _removeListener = function _removeListener(element, type, func) {
  if (element.removeEventListener) {
    var touchType = _touchEventLookup[type];
    element.removeEventListener(touchType || type, func);

    if (touchType && type !== touchType && touchType.substr(0, 7) !== "pointer") {
      element.removeEventListener(type, func);
    }
  }
},
    _preventDefault = function _preventDefault(event) {
  if (event.preventDefault) {
    event.preventDefault();

    if (event.preventManipulation) {
      event.preventManipulation(); //for some Microsoft browsers
    }
  }
},
    _hasTouchID = function _hasTouchID(list, ID) {
  var i = list.length;

  while (i--) {
    if (list[i].identifier === ID) {
      return true;
    }
  }
},
    _onMultiTouchDocumentEnd = function _onMultiTouchDocumentEnd(event) {
  _isMultiTouching = event.touches && _dragCount < event.touches.length;

  _removeListener(event.target, "touchend", _onMultiTouchDocumentEnd);
},
    _onMultiTouchDocument = function _onMultiTouchDocument(event) {
  _isMultiTouching = event.touches && _dragCount < event.touches.length;

  _addListener(event.target, "touchend", _onMultiTouchDocumentEnd);
},
    _getDocScrollTop = function _getDocScrollTop(doc) {
  return _win.pageYOffset || doc.scrollTop || doc.documentElement.scrollTop || doc.body.scrollTop || 0;
},
    _getDocScrollLeft = function _getDocScrollLeft(doc) {
  return _win.pageXOffset || doc.scrollLeft || doc.documentElement.scrollLeft || doc.body.scrollLeft || 0;
},
    _addScrollListener = function _addScrollListener(e, callback) {
  _addListener(e, "scroll", callback);

  if (!_isRoot(e.parentNode)) {
    _addScrollListener(e.parentNode, callback);
  }
},
    _removeScrollListener = function _removeScrollListener(e, callback) {
  _removeListener(e, "scroll", callback);

  if (!_isRoot(e.parentNode)) {
    _removeScrollListener(e.parentNode, callback);
  }
},
    _isRoot = function _isRoot(e) {
  return !!(!e || e === _docElement || e.nodeType === 9 || e === _doc.body || e === _win || !e.nodeType || !e.parentNode);
},
    _getMaxScroll = function _getMaxScroll(element, axis) {
  var dim = axis === "x" ? "Width" : "Height",
      scroll = "scroll" + dim,
      client = "client" + dim;
  return Math.max(0, _isRoot(element) ? Math.max(_docElement[scroll], _body[scroll]) - (_win["inner" + dim] || _docElement[client] || _body[client]) : element[scroll] - element[client]);
},
    _recordMaxScrolls = function _recordMaxScrolls(e) {
  //records _gsMaxScrollX and _gsMaxScrollY properties for the element and all ancestors up the chain so that we can cap it, otherwise dragging beyond the edges with autoScroll on can endlessly scroll.
  var x = _getMaxScroll(e, "x"),
      y = _getMaxScroll(e, "y");

  if (_isRoot(e)) {
    e = _windowProxy;
  } else {
    _recordMaxScrolls(e.parentNode);
  }

  e._gsMaxScrollX = x;
  e._gsMaxScrollY = y;
  e._gsScrollX = e.scrollLeft || 0;
  e._gsScrollY = e.scrollTop || 0;
},
    _setStyle = function _setStyle(element, property, value) {
  var style = element.style;

  if (!style) {
    return;
  }

  if (_isUndefined(style[property])) {
    property = _checkPrefix(property, element) || property;
  }

  if (value == null) {
    style.removeProperty && style.removeProperty(property.replace(/([A-Z])/g, "-$1").toLowerCase());
  } else {
    style[property] = value;
  }
},
    _getComputedStyle = function _getComputedStyle(element) {
  return _win.getComputedStyle(element instanceof Element ? element : element.host || (element.parentNode || {}).host || element);
},
    //the "host" stuff helps to accommodate ShadowDom objects.
_tempRect = {},
    //reuse to reduce garbage collection tasks
_parseRect = function _parseRect(e) {
  //accepts a DOM element, a mouse event, or a rectangle object and returns the corresponding rectangle with left, right, width, height, top, and bottom properties
  if (e === _win) {
    _tempRect.left = _tempRect.top = 0;
    _tempRect.width = _tempRect.right = _docElement.clientWidth || e.innerWidth || _body.clientWidth || 0;
    _tempRect.height = _tempRect.bottom = (e.innerHeight || 0) - 20 < _docElement.clientHeight ? _docElement.clientHeight : e.innerHeight || _body.clientHeight || 0;
    return _tempRect;
  }

  var doc = e.ownerDocument || _doc,
      r = !_isUndefined(e.pageX) ? {
    left: e.pageX - _getDocScrollLeft(doc),
    top: e.pageY - _getDocScrollTop(doc),
    right: e.pageX - _getDocScrollLeft(doc) + 1,
    bottom: e.pageY - _getDocScrollTop(doc) + 1
  } : !e.nodeType && !_isUndefined(e.left) && !_isUndefined(e.top) ? e : _toArray(e)[0].getBoundingClientRect();

  if (_isUndefined(r.right) && !_isUndefined(r.width)) {
    r.right = r.left + r.width;
    r.bottom = r.top + r.height;
  } else if (_isUndefined(r.width)) {
    //some browsers don't include width and height properties. We can't just set them directly on r because some browsers throw errors, so create a new generic object.
    r = {
      width: r.right - r.left,
      height: r.bottom - r.top,
      right: r.right,
      left: r.left,
      bottom: r.bottom,
      top: r.top
    };
  }

  return r;
},
    _dispatchEvent = function _dispatchEvent(target, type, callbackName) {
  var vars = target.vars,
      callback = vars[callbackName],
      listeners = target._listeners[type],
      result;

  if (_isFunction(callback)) {
    result = callback.apply(vars.callbackScope || target, vars[callbackName + "Params"] || [target.pointerEvent]);
  }

  if (listeners && target.dispatchEvent(type) === false) {
    result = false;
  }

  return result;
},
    _getBounds = function _getBounds(target, context) {
  //accepts any of the following: a DOM element, jQuery object, selector text, or an object defining bounds as {top, left, width, height} or {minX, maxX, minY, maxY}. Returns an object with left, top, width, and height properties.
  var e = _toArray(target)[0],
      top,
      left,
      offset;

  if (!e.nodeType && e !== _win) {
    if (!_isUndefined(target.left)) {
      offset = {
        x: 0,
        y: 0
      }; //_getOffsetTransformOrigin(context); //the bounds should be relative to the origin

      return {
        left: target.left - offset.x,
        top: target.top - offset.y,
        width: target.width,
        height: target.height
      };
    }

    left = target.min || target.minX || target.minRotation || 0;
    top = target.min || target.minY || 0;
    return {
      left: left,
      top: top,
      width: (target.max || target.maxX || target.maxRotation || 0) - left,
      height: (target.max || target.maxY || 0) - top
    };
  }

  return _getElementBounds(e, context);
},
    _point1 = {},
    //we reuse to minimize garbage collection tasks.
_getElementBounds = function _getElementBounds(element, context) {
  context = _toArray(context)[0];
  var isSVG = element.getBBox && element.ownerSVGElement,
      doc = element.ownerDocument || _doc,
      left,
      right,
      top,
      bottom,
      matrix,
      p1,
      p2,
      p3,
      p4,
      bbox,
      width,
      height,
      cs,
      contextParent;

  if (element === _win) {
    top = _getDocScrollTop(doc);
    left = _getDocScrollLeft(doc);
    right = left + (doc.documentElement.clientWidth || element.innerWidth || doc.body.clientWidth || 0);
    bottom = top + ((element.innerHeight || 0) - 20 < doc.documentElement.clientHeight ? doc.documentElement.clientHeight : element.innerHeight || doc.body.clientHeight || 0); //some browsers (like Firefox) ignore absolutely positioned elements, and collapse the height of the documentElement, so it could be 8px, for example, if you have just an absolutely positioned div. In that case, we use the innerHeight to resolve this.
  } else if (context === _win || _isUndefined(context)) {
    return element.getBoundingClientRect();
  } else {
    left = top = 0;

    if (isSVG) {
      bbox = element.getBBox();
      width = bbox.width;
      height = bbox.height;
    } else {
      if (element.viewBox && (bbox = element.viewBox.baseVal)) {
        left = bbox.x || 0;
        top = bbox.y || 0;
        width = bbox.width;
        height = bbox.height;
      }

      if (!width) {
        cs = _getComputedStyle(element);
        width = (parseFloat(cs.width) || element.clientWidth || 0) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
        height = (parseFloat(cs.height) || element.clientHeight || 0) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
      }
    }

    right = width;
    bottom = height;
  }

  if (element === context) {
    return {
      left: left,
      top: top,
      width: right - left,
      height: bottom - top
    };
  }

  matrix = Object(_utils_matrix_js__WEBPACK_IMPORTED_MODULE_0__["getGlobalMatrix"])(context, true).multiply(Object(_utils_matrix_js__WEBPACK_IMPORTED_MODULE_0__["getGlobalMatrix"])(element));
  p1 = matrix.apply({
    x: left,
    y: top
  });
  p2 = matrix.apply({
    x: right,
    y: top
  });
  p3 = matrix.apply({
    x: right,
    y: bottom
  });
  p4 = matrix.apply({
    x: left,
    y: bottom
  });
  left = Math.min(p1.x, p2.x, p3.x, p4.x);
  top = Math.min(p1.y, p2.y, p3.y, p4.y);
  contextParent = context.parentNode || {};
  return {
    left: left + (contextParent.scrollLeft || 0),
    top: top + (contextParent.scrollTop || 0),
    width: Math.max(p1.x, p2.x, p3.x, p4.x) - left,
    height: Math.max(p1.y, p2.y, p3.y, p4.y) - top
  };
},
    _parseInertia = function _parseInertia(draggable, snap, max, min, factor, forceZeroVelocity) {
  var vars = {},
      a,
      i,
      l;

  if (snap) {
    if (factor !== 1 && snap instanceof Array) {
      //some data must be altered to make sense, like if the user passes in an array of rotational values in degrees, we must convert it to radians. Or for scrollLeft and scrollTop, we invert the values.
      vars.end = a = [];
      l = snap.length;

      if (_isObject(snap[0])) {
        //if the array is populated with objects, like points ({x:100, y:200}), make copies before multiplying by the factor, otherwise we'll mess up the originals and the user may reuse it elsewhere.
        for (i = 0; i < l; i++) {
          a[i] = _copy(snap[i], factor);
        }
      } else {
        for (i = 0; i < l; i++) {
          a[i] = snap[i] * factor;
        }
      }

      max += 1.1; //allow 1.1 pixels of wiggle room when snapping in order to work around some browser inconsistencies in the way bounds are reported which can make them roughly a pixel off. For example, if "snap:[-$('#menu').width(), 0]" was defined and #menu had a wrapper that was used as the bounds, some browsers would be one pixel off, making the minimum -752 for example when snap was [-753,0], thus instead of snapping to -753, it would snap to 0 since -753 was below the minimum.

      min -= 1.1;
    } else if (_isFunction(snap)) {
      vars.end = function (value) {
        var result = snap.call(draggable, value),
            copy,
            p;

        if (factor !== 1) {
          if (_isObject(result)) {
            copy = {};

            for (p in result) {
              copy[p] = result[p] * factor;
            }

            result = copy;
          } else {
            result *= factor;
          }
        }

        return result; //we need to ensure that we can scope the function call to the Draggable instance itself so that users can access important values like maxX, minX, maxY, minY, x, and y from within that function.
      };
    } else {
      vars.end = snap;
    }
  }

  if (max || max === 0) {
    vars.max = max;
  }

  if (min || min === 0) {
    vars.min = min;
  }

  if (forceZeroVelocity) {
    vars.velocity = 0;
  }

  return vars;
},
    _isClickable = function _isClickable(element) {
  //sometimes it's convenient to mark an element as clickable by adding a data-clickable="true" attribute (in which case we won't preventDefault() the mouse/touch event). This method checks if the element is an <a>, <input>, or <button> or has an onclick or has the data-clickable or contentEditable attribute set to true (or any of its parent elements).
  var data;
  return !element || !element.getAttribute || element === _body ? false : (data = element.getAttribute("data-clickable")) === "true" || data !== "false" && (element.onclick || _clickableTagExp.test(element.nodeName + "") || element.getAttribute("contentEditable") === "true") ? true : _isClickable(element.parentNode);
},
    _setSelectable = function _setSelectable(elements, selectable) {
  var i = elements.length,
      e;

  while (i--) {
    e = elements[i];
    e.ondragstart = e.onselectstart = selectable ? null : _emptyFunc; //setStyle(e, "userSelect", (selectable ? "text" : "none"));

    gsap.set(e, {
      lazy: true,
      userSelect: selectable ? "text" : "none"
    });
  }
},
    _isFixed = function _isFixed(element) {
  if (_getComputedStyle(element).position === "fixed") {
    return true;
  }

  element = element.parentNode;

  if (element && element.nodeType === 1) {
    // avoid document fragments which will throw an error.
    return _isFixed(element);
  }
},
    _supports3D,
    _addPaddingBR,
    //The ScrollProxy class wraps an element's contents into another div (we call it "content") that we either add padding when necessary or apply a translate3d() transform in order to overscroll (scroll past the boundaries). This allows us to simply set the scrollTop/scrollLeft (or top/left for easier reverse-axis orientation, which is what we do in Draggable) and it'll do all the work for us. For example, if we tried setting scrollTop to -100 on a normal DOM element, it wouldn't work - it'd look the same as setting it to 0, but if we set scrollTop of a ScrollProxy to -100, it'll give the correct appearance by either setting paddingTop of the wrapper to 100 or applying a 100-pixel translateY.
ScrollProxy = function ScrollProxy(element, vars) {
  element = gsap.utils.toArray(element)[0];
  vars = vars || {};
  var content = document.createElement("div"),
      style = content.style,
      node = element.firstChild,
      offsetTop = 0,
      offsetLeft = 0,
      prevTop = element.scrollTop,
      prevLeft = element.scrollLeft,
      scrollWidth = element.scrollWidth,
      scrollHeight = element.scrollHeight,
      extraPadRight = 0,
      maxLeft = 0,
      maxTop = 0,
      elementWidth,
      elementHeight,
      contentHeight,
      nextNode,
      transformStart,
      transformEnd;

  if (_supports3D && vars.force3D !== false) {
    transformStart = "translate3d(";
    transformEnd = "px,0px)";
  } else if (_transformProp) {
    transformStart = "translate(";
    transformEnd = "px)";
  }

  this.scrollTop = function (value, force) {
    if (!arguments.length) {
      return -this.top();
    }

    this.top(-value, force);
  };

  this.scrollLeft = function (value, force) {
    if (!arguments.length) {
      return -this.left();
    }

    this.left(-value, force);
  };

  this.left = function (value, force) {
    if (!arguments.length) {
      return -(element.scrollLeft + offsetLeft);
    }

    var dif = element.scrollLeft - prevLeft,
        oldOffset = offsetLeft;

    if ((dif > 2 || dif < -2) && !force) {
      //if the user interacts with the scrollbar (or something else scrolls it, like the mouse wheel), we should kill any tweens of the ScrollProxy.
      prevLeft = element.scrollLeft;
      gsap.killTweensOf(this, {
        left: 1,
        scrollLeft: 1
      });
      this.left(-prevLeft);

      if (vars.onKill) {
        vars.onKill();
      }

      return;
    }

    value = -value; //invert because scrolling works in the opposite direction

    if (value < 0) {
      offsetLeft = value - 0.5 | 0;
      value = 0;
    } else if (value > maxLeft) {
      offsetLeft = value - maxLeft | 0;
      value = maxLeft;
    } else {
      offsetLeft = 0;
    }

    if (offsetLeft || oldOffset) {
      if (!this._skip) {
        style[_transformProp] = transformStart + -offsetLeft + "px," + -offsetTop + transformEnd;
      }

      if (offsetLeft + extraPadRight >= 0) {
        style.paddingRight = offsetLeft + extraPadRight + "px";
      }
    }

    element.scrollLeft = value | 0;
    prevLeft = element.scrollLeft; //don't merge this with the line above because some browsers adjust the scrollLeft after it's set, so in order to be 100% accurate in tracking it, we need to ask the browser to report it.
  };

  this.top = function (value, force) {
    if (!arguments.length) {
      return -(element.scrollTop + offsetTop);
    }

    var dif = element.scrollTop - prevTop,
        oldOffset = offsetTop;

    if ((dif > 2 || dif < -2) && !force) {
      //if the user interacts with the scrollbar (or something else scrolls it, like the mouse wheel), we should kill any tweens of the ScrollProxy.
      prevTop = element.scrollTop;
      gsap.killTweensOf(this, {
        top: 1,
        scrollTop: 1
      });
      this.top(-prevTop);

      if (vars.onKill) {
        vars.onKill();
      }

      return;
    }

    value = -value; //invert because scrolling works in the opposite direction

    if (value < 0) {
      offsetTop = value - 0.5 | 0;
      value = 0;
    } else if (value > maxTop) {
      offsetTop = value - maxTop | 0;
      value = maxTop;
    } else {
      offsetTop = 0;
    }

    if (offsetTop || oldOffset) {
      if (!this._skip) {
        style[_transformProp] = transformStart + -offsetLeft + "px," + -offsetTop + transformEnd;
      }
    }

    element.scrollTop = value | 0;
    prevTop = element.scrollTop;
  };

  this.maxScrollTop = function () {
    return maxTop;
  };

  this.maxScrollLeft = function () {
    return maxLeft;
  };

  this.disable = function () {
    node = content.firstChild;

    while (node) {
      nextNode = node.nextSibling;
      element.appendChild(node);
      node = nextNode;
    }

    if (element === content.parentNode) {
      //in case disable() is called when it's already disabled.
      element.removeChild(content);
    }
  };

  this.enable = function () {
    node = element.firstChild;

    if (node === content) {
      return;
    }

    while (node) {
      nextNode = node.nextSibling;
      content.appendChild(node);
      node = nextNode;
    }

    element.appendChild(content);
    this.calibrate();
  };

  this.calibrate = function (force) {
    var widthMatches = element.clientWidth === elementWidth,
        cs,
        x,
        y;
    prevTop = element.scrollTop;
    prevLeft = element.scrollLeft;

    if (widthMatches && element.clientHeight === elementHeight && content.offsetHeight === contentHeight && scrollWidth === element.scrollWidth && scrollHeight === element.scrollHeight && !force) {
      return; //no need to recalculate things if the width and height haven't changed.
    }

    if (offsetTop || offsetLeft) {
      x = this.left();
      y = this.top();
      this.left(-element.scrollLeft);
      this.top(-element.scrollTop);
    }

    cs = _getComputedStyle(element); //first, we need to remove any width constraints to see how the content naturally flows so that we can see if it's wider than the containing element. If so, we've got to record the amount of overage so that we can apply that as padding in order for browsers to correctly handle things. Then we switch back to a width of 100% (without that, some browsers don't flow the content correctly)

    if (!widthMatches || force) {
      style.display = "block";
      style.width = "auto";
      style.paddingRight = "0px";
      extraPadRight = Math.max(0, element.scrollWidth - element.clientWidth); //if the content is wider than the container, we need to add the paddingLeft and paddingRight in order for things to behave correctly.

      if (extraPadRight) {
        extraPadRight += parseFloat(cs.paddingLeft) + (_addPaddingBR ? parseFloat(cs.paddingRight) : 0);
      }
    }

    style.display = "inline-block";
    style.position = "relative";
    style.overflow = "visible";
    style.verticalAlign = "top";
    style.boxSizing = "content-box";
    style.width = "100%";
    style.paddingRight = extraPadRight + "px"; //some browsers neglect to factor in the bottom padding when calculating the scrollHeight, so we need to add that padding to the content when that happens. Allow a 2px margin for error

    if (_addPaddingBR) {
      style.paddingBottom = cs.paddingBottom;
    }

    elementWidth = element.clientWidth;
    elementHeight = element.clientHeight;
    scrollWidth = element.scrollWidth;
    scrollHeight = element.scrollHeight;
    maxLeft = element.scrollWidth - elementWidth;
    maxTop = element.scrollHeight - elementHeight;
    contentHeight = content.offsetHeight;
    style.display = "block";

    if (x || y) {
      this.left(x);
      this.top(y);
    }
  };

  this.content = content;
  this.element = element;
  this._skip = false;
  this.enable();
},
    _initCore = function _initCore(required) {
  if (_windowExists() && document.body) {
    _win = window;
    _doc = document;
    _docElement = _doc.documentElement;
    _body = _doc.body;
    _tempDiv = _createElement("div");
    _supportsPointer = !!window.PointerEvent;
    _placeholderDiv = _createElement("div");
    _placeholderDiv.style.cssText = "visibility:hidden;height:1px;top:-1px;pointer-events:none;position:relative;clear:both;cursor:grab";
    _defaultCursor = _placeholderDiv.style.cursor === "grab" ? "grab" : "move";
    _isAndroid = _win.navigator && _win.navigator.userAgent.toLowerCase().indexOf("android") !== -1; //Android handles touch events in an odd way and it's virtually impossible to "feature test" so we resort to UA sniffing

    _isTouchDevice = "ontouchstart" in _docElement && "orientation" in _win;

    _addPaddingBR = function () {
      //this function is in charge of analyzing browser behavior related to padding. It sets the _addPaddingBR to true if the browser doesn't normally factor in the bottom or right padding on the element inside the scrolling area, and it sets _addPaddingLeft to true if it's a browser that requires the extra offset (offsetLeft) to be added to the paddingRight (like Opera).
      var div = _createElement("div"),
          child = _createElement("div"),
          childStyle = child.style,
          parent = _body,
          val;

      childStyle.display = "inline-block";
      childStyle.position = "relative";
      div.style.cssText = child.innerHTML = "width:90px;height:40px;padding:10px;overflow:auto;visibility:hidden";
      div.appendChild(child);
      parent.appendChild(div);
      val = child.offsetHeight + 18 > div.scrollHeight; //div.scrollHeight should be child.offsetHeight + 20 because of the 10px of padding on each side, but some browsers ignore one side. We allow a 2px margin of error.

      parent.removeChild(div);
      return val;
    }();

    _touchEventLookup = function (types) {
      //we create an object that makes it easy to translate touch event types into their "pointer" counterparts if we're in a browser that uses those instead. Like IE10 uses "MSPointerDown" instead of "touchstart", for example.
      var standard = types.split(","),
          converted = (!_isUndefined(_tempDiv.onpointerdown) ? "pointerdown,pointermove,pointerup,pointercancel" : !_isUndefined(_tempDiv.onmspointerdown) ? "MSPointerDown,MSPointerMove,MSPointerUp,MSPointerCancel" : types).split(","),
          obj = {},
          i = 4;

      while (--i > -1) {
        obj[standard[i]] = converted[i];
        obj[converted[i]] = standard[i];
      } //to avoid problems in iOS 9, test to see if the browser supports the "passive" option on addEventListener().


      try {
        _docElement.addEventListener("test", null, Object.defineProperty({}, "passive", {
          get: function get() {
            _supportsPassive = 1;
          }
        }));
      } catch (e) {}

      return obj;
    }("touchstart,touchmove,touchend,touchcancel");

    _addListener(_doc, "touchcancel", _emptyFunc); //some older Android devices intermittently stop dispatching "touchmove" events if we don't listen for "touchcancel" on the document. Very strange indeed.


    _addListener(_win, "touchmove", _emptyFunc); //works around Safari bugs that still allow the page to scroll even when we preventDefault() on the touchmove event.


    _body && _body.addEventListener("touchstart", _emptyFunc); //works around Safari bug: https://greensock.com/forums/topic/21450-draggable-in-iframe-on-mobile-is-buggy/

    _addListener(_doc, "contextmenu", function () {
      for (var p in _lookup) {
        if (_lookup[p].isPressed) {
          _lookup[p].endDrag();
        }
      }
    });

    gsap = _coreInitted = _getGSAP();
  }

  if (gsap) {
    InertiaPlugin = gsap.plugins.inertia;
    _checkPrefix = gsap.utils.checkPrefix;
    _transformProp = _checkPrefix(_transformProp);
    _transformOriginProp = _checkPrefix(_transformOriginProp);
    _toArray = gsap.utils.toArray;
    _supports3D = !!_checkPrefix("perspective");
  } else if (required) {
    console.warn("Please gsap.registerPlugin(Draggable)");
  }
};

var EventDispatcher =
/*#__PURE__*/
function () {
  function EventDispatcher(target) {
    this._listeners = {};
    this.target = target || this;
  }

  var _proto = EventDispatcher.prototype;

  _proto.addEventListener = function addEventListener(type, callback) {
    var list = this._listeners[type] || (this._listeners[type] = []);

    if (!~list.indexOf(callback)) {
      list.push(callback);
    }
  };

  _proto.removeEventListener = function removeEventListener(type, callback) {
    var list = this._listeners[type],
        i = list && list.indexOf(callback) || -1;
    i > -1 && list.splice(i, 1);
  };

  _proto.dispatchEvent = function dispatchEvent(type) {
    var _this = this;

    var result;
    (this._listeners[type] || []).forEach(function (callback) {
      return callback.call(_this, {
        type: type,
        target: _this.target
      }) === false && (result = false);
    });
    return result; //if any of the callbacks return false, pass that along.
  };

  return EventDispatcher;
}();

var Draggable =
/*#__PURE__*/
function (_EventDispatcher) {
  _inheritsLoose(Draggable, _EventDispatcher);

  function Draggable(target, vars) {
    var _this2;

    _this2 = _EventDispatcher.call(this) || this;

    if (!gsap) {
      _initCore(1);
    }

    target = _toArray(target)[0]; //in case the target is a selector object or selector text

    if (!InertiaPlugin) {
      InertiaPlugin = gsap.plugins.inertia;
    }

    _this2.vars = vars = _copy(vars || {});
    _this2.target = target;
    _this2.x = _this2.y = _this2.rotation = 0;
    _this2.dragResistance = parseFloat(vars.dragResistance) || 0;
    _this2.edgeResistance = isNaN(vars.edgeResistance) ? 1 : parseFloat(vars.edgeResistance) || 0;
    _this2.lockAxis = vars.lockAxis;
    _this2.autoScroll = vars.autoScroll || 0;
    _this2.lockedAxis = null;
    _this2.allowEventDefault = !!vars.allowEventDefault;
    gsap.getProperty(target, "x"); // to ensure that transforms are instantiated.

    var type = (vars.type || "x,y").toLowerCase(),
        xyMode = ~type.indexOf("x") || ~type.indexOf("y"),
        rotationMode = type.indexOf("rotation") !== -1,
        xProp = rotationMode ? "rotation" : xyMode ? "x" : "left",
        yProp = xyMode ? "y" : "top",
        allowX = !!(~type.indexOf("x") || ~type.indexOf("left") || type === "scroll"),
        allowY = !!(~type.indexOf("y") || ~type.indexOf("top") || type === "scroll"),
        minimumMovement = vars.minimumMovement || 2,
        self = _assertThisInitialized(_this2),
        triggers = _toArray(vars.trigger || vars.handle || target),
        killProps = {},
        dragEndTime = 0,
        checkAutoScrollBounds = false,
        autoScrollMarginTop = vars.autoScrollMarginTop || 40,
        autoScrollMarginRight = vars.autoScrollMarginRight || 40,
        autoScrollMarginBottom = vars.autoScrollMarginBottom || 40,
        autoScrollMarginLeft = vars.autoScrollMarginLeft || 40,
        isClickable = vars.clickableTest || _isClickable,
        clickTime = 0,
        gsCache = target._gsap || gsap.core.getCache(target),
        isFixed = _isFixed(target),
        getPropAsNum = function getPropAsNum(property, unit) {
      return parseFloat(gsCache.get(target, property, unit));
    },
        ownerDoc = target.ownerDocument || _doc,
        enabled,
        scrollProxy,
        startPointerX,
        startPointerY,
        startElementX,
        startElementY,
        hasBounds,
        hasDragCallback,
        hasMoveCallback,
        maxX,
        minX,
        maxY,
        minY,
        touch,
        touchID,
        rotationOrigin,
        dirty,
        old,
        snapX,
        snapY,
        snapXY,
        isClicking,
        touchEventTarget,
        matrix,
        interrupted,
        startScrollTop,
        startScrollLeft,
        allowNativeTouchScrolling,
        touchDragAxis,
        isDispatching,
        clickDispatch,
        trustedClickDispatch,
        onContextMenu = function onContextMenu(e) {
      //used to prevent long-touch from triggering a context menu.
      if (self.isPressed && e.which < 2) {
        self.endDrag();
      } else {
        _preventDefault(e);

        e.stopPropagation();
        return false;
      }
    },
        //this method gets called on every tick of TweenLite.ticker which allows us to synchronize the renders to the core engine (which is typically synchronized with the display refresh via requestAnimationFrame). This is an optimization - it's better than applying the values inside the "mousemove" or "touchmove" event handler which may get called many times inbetween refreshes.
    render = function render(suppressEvents) {
      if (self.autoScroll && self.isDragging && (checkAutoScrollBounds || dirty)) {
        var e = target,
            autoScrollFactor = self.autoScroll * 15,
            //multiplying by 15 just gives us a better "feel" speed-wise.
        parent,
            isRoot,
            rect,
            pointerX,
            pointerY,
            changeX,
            changeY,
            gap;
        checkAutoScrollBounds = false;
        _windowProxy.scrollTop = _win.pageYOffset != null ? _win.pageYOffset : ownerDoc.documentElement.scrollTop != null ? ownerDoc.documentElement.scrollTop : ownerDoc.body.scrollTop;
        _windowProxy.scrollLeft = _win.pageXOffset != null ? _win.pageXOffset : ownerDoc.documentElement.scrollLeft != null ? ownerDoc.documentElement.scrollLeft : ownerDoc.body.scrollLeft;
        pointerX = self.pointerX - _windowProxy.scrollLeft;
        pointerY = self.pointerY - _windowProxy.scrollTop;

        while (e && !isRoot) {
          //walk up the chain and sense wherever the pointer is within 40px of an edge that's scrollable.
          isRoot = _isRoot(e.parentNode);
          parent = isRoot ? _windowProxy : e.parentNode;
          rect = isRoot ? {
            bottom: Math.max(_docElement.clientHeight, _win.innerHeight || 0),
            right: Math.max(_docElement.clientWidth, _win.innerWidth || 0),
            left: 0,
            top: 0
          } : parent.getBoundingClientRect();
          changeX = changeY = 0;

          if (allowY) {
            gap = parent._gsMaxScrollY - parent.scrollTop;

            if (gap < 0) {
              changeY = gap;
            } else if (pointerY > rect.bottom - autoScrollMarginBottom && gap) {
              checkAutoScrollBounds = true;
              changeY = Math.min(gap, autoScrollFactor * (1 - Math.max(0, rect.bottom - pointerY) / autoScrollMarginBottom) | 0);
            } else if (pointerY < rect.top + autoScrollMarginTop && parent.scrollTop) {
              checkAutoScrollBounds = true;
              changeY = -Math.min(parent.scrollTop, autoScrollFactor * (1 - Math.max(0, pointerY - rect.top) / autoScrollMarginTop) | 0);
            }

            if (changeY) {
              parent.scrollTop += changeY;
            }
          }

          if (allowX) {
            gap = parent._gsMaxScrollX - parent.scrollLeft;

            if (gap < 0) {
              changeX = gap;
            } else if (pointerX > rect.right - autoScrollMarginRight && gap) {
              checkAutoScrollBounds = true;
              changeX = Math.min(gap, autoScrollFactor * (1 - Math.max(0, rect.right - pointerX) / autoScrollMarginRight) | 0);
            } else if (pointerX < rect.left + autoScrollMarginLeft && parent.scrollLeft) {
              checkAutoScrollBounds = true;
              changeX = -Math.min(parent.scrollLeft, autoScrollFactor * (1 - Math.max(0, pointerX - rect.left) / autoScrollMarginLeft) | 0);
            }

            if (changeX) {
              parent.scrollLeft += changeX;
            }
          }

          if (isRoot && (changeX || changeY)) {
            _win.scrollTo(parent.scrollLeft, parent.scrollTop);

            setPointerPosition(self.pointerX + changeX, self.pointerY + changeY);
          }

          e = parent;
        }
      }

      if (dirty) {
        var x = self.x,
            y = self.y;

        if (rotationMode) {
          self.deltaX = x - parseFloat(gsCache.rotation);
          self.rotation = x;
          gsCache.rotation = x + "deg";
          gsCache.renderTransform(1, gsCache);
        } else {
          if (scrollProxy) {
            if (allowY) {
              self.deltaY = y - scrollProxy.top();
              scrollProxy.top(y);
            }

            if (allowX) {
              self.deltaX = x - scrollProxy.left();
              scrollProxy.left(x);
            }
          } else if (xyMode) {
            if (allowY) {
              self.deltaY = y - parseFloat(gsCache.y);
              gsCache.y = y + "px";
            }

            if (allowX) {
              self.deltaX = x - parseFloat(gsCache.x);
              gsCache.x = x + "px";
            }

            gsCache.renderTransform(1, gsCache);
          } else {
            if (allowY) {
              self.deltaY = y - parseFloat(target.style.top || 0);
              target.style.top = y + "px";
            }

            if (allowX) {
              self.deltaY = x - parseFloat(target.style.left || 0);
              target.style.left = x + "px";
            }
          }
        }

        if (hasDragCallback && !suppressEvents && !isDispatching) {
          isDispatching = true; //in case onDrag has an update() call (avoid endless loop)

          if (_dispatchEvent(self, "drag", "onDrag") === false) {
            if (allowX) {
              self.x -= self.deltaX;
            }

            if (allowY) {
              self.y -= self.deltaY;
            }

            render(true);
          }

          isDispatching = false;
        }
      }

      dirty = false;
    },
        //copies the x/y from the element (whether that be transforms, top/left, or ScrollProxy's top/left) to the Draggable's x and y (and rotation if necessary) properties so that they reflect reality and it also (optionally) applies any snapping necessary. This is used by the InertiaPlugin tween in an onUpdate to ensure things are synced and snapped.
    syncXY = function syncXY(skipOnUpdate, skipSnap) {
      var x = self.x,
          y = self.y,
          snappedValue,
          cs;

      if (!target._gsap) {
        //just in case the _gsap cache got wiped, like if the user called clearProps on the transform or something (very rare).
        gsCache = gsap.core.getCache(target);
      }

      if (xyMode) {
        self.x = parseFloat(gsCache.x);
        self.y = parseFloat(gsCache.y);
      } else if (rotationMode) {
        self.x = self.rotation = parseFloat(gsCache.rotation);
      } else if (scrollProxy) {
        self.y = scrollProxy.top();
        self.x = scrollProxy.left();
      } else {
        self.y = parseInt(target.style.top || (cs = _getComputedStyle(target)) && cs.top, 10) || 0;
        self.x = parseInt(target.style.left || (cs || {}).left, 10) || 0;
      }

      if ((snapX || snapY || snapXY) && !skipSnap && (self.isDragging || self.isThrowing)) {
        if (snapXY) {
          _temp1.x = self.x;
          _temp1.y = self.y;
          snappedValue = snapXY(_temp1);

          if (snappedValue.x !== self.x) {
            self.x = snappedValue.x;
            dirty = true;
          }

          if (snappedValue.y !== self.y) {
            self.y = snappedValue.y;
            dirty = true;
          }
        }

        if (snapX) {
          snappedValue = snapX(self.x);

          if (snappedValue !== self.x) {
            self.x = snappedValue;

            if (rotationMode) {
              self.rotation = snappedValue;
            }

            dirty = true;
          }
        }

        if (snapY) {
          snappedValue = snapY(self.y);

          if (snappedValue !== self.y) {
            self.y = snappedValue;
          }

          dirty = true;
        }
      }

      if (dirty) {
        render(true);
      }

      if (!skipOnUpdate) {
        self.deltaX = self.x - x;
        self.deltaY = self.y - y;

        _dispatchEvent(self, "throwupdate", "onThrowUpdate");
      }
    },
        buildSnapFunc = function buildSnapFunc(snap, min, max, factor) {
      if (min == null) {
        min = -_bigNum;
      }

      if (max == null) {
        max = _bigNum;
      }

      if (_isFunction(snap)) {
        return function (n) {
          var edgeTolerance = !self.isPressed ? 1 : 1 - self.edgeResistance; //if we're tweening, disable the edgeTolerance because it's already factored into the tweening values (we don't want to apply it multiple times)

          return snap.call(self, n > max ? max + (n - max) * edgeTolerance : n < min ? min + (n - min) * edgeTolerance : n) * factor;
        };
      }

      if (_isArray(snap)) {
        return function (n) {
          var i = snap.length,
              closest = 0,
              absDif = _bigNum,
              val,
              dif;

          while (--i > -1) {
            val = snap[i];
            dif = val - n;

            if (dif < 0) {
              dif = -dif;
            }

            if (dif < absDif && val >= min && val <= max) {
              closest = i;
              absDif = dif;
            }
          }

          return snap[closest];
        };
      }

      return isNaN(snap) ? function (n) {
        return n;
      } : function () {
        return snap * factor;
      };
    },
        buildPointSnapFunc = function buildPointSnapFunc(snap, minX, maxX, minY, maxY, radius, factor) {
      radius = radius && radius < _bigNum ? radius * radius : _bigNum; //so we don't have to Math.sqrt() in the functions. Performance optimization.

      if (_isFunction(snap)) {
        return function (point) {
          var edgeTolerance = !self.isPressed ? 1 : 1 - self.edgeResistance,
              x = point.x,
              y = point.y,
              result,
              dx,
              dy; //if we're tweening, disable the edgeTolerance because it's already factored into the tweening values (we don't want to apply it multiple times)

          point.x = x = x > maxX ? maxX + (x - maxX) * edgeTolerance : x < minX ? minX + (x - minX) * edgeTolerance : x;
          point.y = y = y > maxY ? maxY + (y - maxY) * edgeTolerance : y < minY ? minY + (y - minY) * edgeTolerance : y;
          result = snap.call(self, point);

          if (result !== point) {
            point.x = result.x;
            point.y = result.y;
          }

          if (factor !== 1) {
            point.x *= factor;
            point.y *= factor;
          }

          if (radius < _bigNum) {
            dx = point.x - x;
            dy = point.y - y;

            if (dx * dx + dy * dy > radius) {
              point.x = x;
              point.y = y;
            }
          }

          return point;
        };
      }

      if (_isArray(snap)) {
        return function (p) {
          var i = snap.length,
              closest = 0,
              minDist = _bigNum,
              x,
              y,
              point,
              dist;

          while (--i > -1) {
            point = snap[i];
            x = point.x - p.x;
            y = point.y - p.y;
            dist = x * x + y * y;

            if (dist < minDist) {
              closest = i;
              minDist = dist;
            }
          }

          return minDist <= radius ? snap[closest] : p;
        };
      }

      return function (n) {
        return n;
      };
    },
        calculateBounds = function calculateBounds() {
      var bounds, targetBounds, snap, snapIsRaw;
      hasBounds = false;

      if (scrollProxy) {
        scrollProxy.calibrate();
        self.minX = minX = -scrollProxy.maxScrollLeft();
        self.minY = minY = -scrollProxy.maxScrollTop();
        self.maxX = maxX = self.maxY = maxY = 0;
        hasBounds = true;
      } else if (!!vars.bounds) {
        bounds = _getBounds(vars.bounds, target.parentNode); //could be a selector/jQuery object or a DOM element or a generic object like {top:0, left:100, width:1000, height:800} or {minX:100, maxX:1100, minY:0, maxY:800}

        if (rotationMode) {
          self.minX = minX = bounds.left;
          self.maxX = maxX = bounds.left + bounds.width;
          self.minY = minY = self.maxY = maxY = 0;
        } else if (!_isUndefined(vars.bounds.maxX) || !_isUndefined(vars.bounds.maxY)) {
          bounds = vars.bounds;
          self.minX = minX = bounds.minX;
          self.minY = minY = bounds.minY;
          self.maxX = maxX = bounds.maxX;
          self.maxY = maxY = bounds.maxY;
        } else {
          targetBounds = _getBounds(target, target.parentNode);
          self.minX = minX = Math.round(getPropAsNum(xProp, "px") + bounds.left - targetBounds.left);
          self.minY = minY = Math.round(getPropAsNum(yProp, "px") + bounds.top - targetBounds.top);
          self.maxX = maxX = Math.round(minX + (bounds.width - targetBounds.width));
          self.maxY = maxY = Math.round(minY + (bounds.height - targetBounds.height));
        }

        if (minX > maxX) {
          self.minX = maxX;
          self.maxX = maxX = minX;
          minX = self.minX;
        }

        if (minY > maxY) {
          self.minY = maxY;
          self.maxY = maxY = minY;
          minY = self.minY;
        }

        if (rotationMode) {
          self.minRotation = minX;
          self.maxRotation = maxX;
        }

        hasBounds = true;
      }

      if (vars.liveSnap) {
        snap = vars.liveSnap === true ? vars.snap || {} : vars.liveSnap;
        snapIsRaw = _isArray(snap) || _isFunction(snap);

        if (rotationMode) {
          snapX = buildSnapFunc(snapIsRaw ? snap : snap.rotation, minX, maxX, 1);
          snapY = null;
        } else {
          if (snap.points) {
            snapXY = buildPointSnapFunc(snapIsRaw ? snap : snap.points, minX, maxX, minY, maxY, snap.radius, scrollProxy ? -1 : 1);
          } else {
            if (allowX) {
              snapX = buildSnapFunc(snapIsRaw ? snap : snap.x || snap.left || snap.scrollLeft, minX, maxX, scrollProxy ? -1 : 1);
            }

            if (allowY) {
              snapY = buildSnapFunc(snapIsRaw ? snap : snap.y || snap.top || snap.scrollTop, minY, maxY, scrollProxy ? -1 : 1);
            }
          }
        }
      }
    },
        onThrowComplete = function onThrowComplete() {
      self.isThrowing = false;

      _dispatchEvent(self, "throwcomplete", "onThrowComplete");
    },
        onThrowInterrupt = function onThrowInterrupt() {
      self.isThrowing = false;
    },
        animate = function animate(inertia, forceZeroVelocity) {
      var snap, snapIsRaw, tween, overshootTolerance;

      if (inertia && InertiaPlugin) {
        if (inertia === true) {
          snap = vars.snap || vars.liveSnap || {};
          snapIsRaw = _isArray(snap) || _isFunction(snap);
          inertia = {
            resistance: (vars.throwResistance || vars.resistance || 1000) / (rotationMode ? 10 : 1)
          };

          if (rotationMode) {
            inertia.rotation = _parseInertia(self, snapIsRaw ? snap : snap.rotation, maxX, minX, 1, forceZeroVelocity);
          } else {
            if (allowX) {
              inertia[xProp] = _parseInertia(self, snapIsRaw ? snap : snap.points || snap.x || snap.left, maxX, minX, scrollProxy ? -1 : 1, forceZeroVelocity || self.lockedAxis === "x");
            }

            if (allowY) {
              inertia[yProp] = _parseInertia(self, snapIsRaw ? snap : snap.points || snap.y || snap.top, maxY, minY, scrollProxy ? -1 : 1, forceZeroVelocity || self.lockedAxis === "y");
            }

            if (snap.points || _isArray(snap) && _isObject(snap[0])) {
              inertia.linkedProps = xProp + "," + yProp;
              inertia.radius = snap.radius; //note: we also disable liveSnapping while throwing if there's a "radius" defined, otherwise it looks weird to have the item thrown past a snapping point but live-snapping mid-tween. We do this by altering the onUpdateParams so that "skipSnap" parameter is true for syncXY.
            }
          }
        }

        self.isThrowing = true;
        overshootTolerance = !isNaN(vars.overshootTolerance) ? vars.overshootTolerance : vars.edgeResistance === 1 ? 0 : 1 - self.edgeResistance + 0.2;

        if (!inertia.duration) {
          inertia.duration = {
            max: Math.max(vars.minDuration || 0, "maxDuration" in vars ? vars.maxDuration : 2),
            min: !isNaN(vars.minDuration) ? vars.minDuration : overshootTolerance === 0 || _isObject(inertia) && inertia.resistance > 1000 ? 0 : 0.5,
            overshoot: overshootTolerance
          };
        }

        self.tween = tween = gsap.to(scrollProxy || target, {
          inertia: inertia,
          data: "_draggable",
          onComplete: onThrowComplete,
          onInterrupt: onThrowInterrupt,
          onUpdate: vars.fastMode ? _dispatchEvent : syncXY,
          onUpdateParams: vars.fastMode ? [self, "onthrowupdate", "onThrowUpdate"] : snap && snap.radius ? [false, true] : []
        });

        if (!vars.fastMode) {
          if (scrollProxy) {
            scrollProxy._skip = true; //Microsoft browsers have a bug that causes them to briefly render the position incorrectly (it flashes to the end state when we seek() the tween even though we jump right back to the current position, and this only seems to happen when we're affecting both top and left), so we set a _suspendTransforms flag to prevent it from actually applying the values in the ScrollProxy.
          }

          tween.render(tween.duration(), true, true);
          syncXY(true, true);
          self.endX = self.x;
          self.endY = self.y;

          if (rotationMode) {
            self.endRotation = self.x;
          }

          tween.play(0);
          syncXY(true, true);

          if (scrollProxy) {
            scrollProxy._skip = false; //Microsoft browsers have a bug that causes them to briefly render the position incorrectly (it flashes to the end state when we seek() the tween even though we jump right back to the current position, and this only seems to happen when we're affecting both top and left), so we set a _suspendTransforms flag to prevent it from actually applying the values in the ScrollProxy.
          }
        }
      } else if (hasBounds) {
        self.applyBounds();
      }
    },
        updateMatrix = function updateMatrix(shiftStart) {
      var start = matrix,
          p;
      matrix = Object(_utils_matrix_js__WEBPACK_IMPORTED_MODULE_0__["getGlobalMatrix"])(target.parentNode, true);

      if (shiftStart && self.isPressed && !matrix.equals(start || new _utils_matrix_js__WEBPACK_IMPORTED_MODULE_0__["Matrix2D"]())) {
        //if the matrix changes WHILE the element is pressed, we must adjust the startPointerX and startPointerY accordingly, so we invert the original matrix and figure out where the pointerX and pointerY were in the global space, then apply the new matrix to get the updated coordinates.
        p = start.inverse().apply({
          x: startPointerX,
          y: startPointerY
        });
        matrix.apply(p, p);
        startPointerX = p.x;
        startPointerY = p.y;
      }

      if (matrix.equals(_identityMatrix)) {
        //if there are no transforms, we can optimize performance by not factoring in the matrix
        matrix = null;
      }
    },
        recordStartPositions = function recordStartPositions() {
      var edgeTolerance = 1 - self.edgeResistance,
          parsedOrigin,
          parent,
          x,
          y;
      updateMatrix(false);

      if (matrix) {
        _point1.x = self.pointerX;
        _point1.y = self.pointerY;
        matrix.apply(_point1, _point1);
        startPointerX = _point1.x; //translate to local coordinate system

        startPointerY = _point1.y;
      }

      if (dirty) {
        setPointerPosition(self.pointerX, self.pointerY);
        render(true);
      }

      if (scrollProxy) {
        calculateBounds();
        startElementY = scrollProxy.top();
        startElementX = scrollProxy.left();
      } else {
        //if the element is in the process of tweening, don't force snapping to occur because it could make it jump. Imagine the user throwing, then before it's done, clicking on the element in its inbetween state.
        if (isTweening()) {
          syncXY(true, true);
          calculateBounds();
        } else {
          self.applyBounds();
        }

        if (rotationMode) {
          parsedOrigin = target.ownerSVGElement ? [gsCache.xOrigin - target.getBBox().x, gsCache.yOrigin - target.getBBox().y] : (_getComputedStyle(target)[_transformOriginProp] || "0 0").split(" ");
          rotationOrigin = self.rotationOrigin = Object(_utils_matrix_js__WEBPACK_IMPORTED_MODULE_0__["getGlobalMatrix"])(target).apply({
            x: parseFloat(parsedOrigin[0]) || 0,
            y: parseFloat(parsedOrigin[1]) || 0
          });
          syncXY(true, true);
          x = self.pointerX - rotationOrigin.x;
          y = rotationOrigin.y - self.pointerY;

          if (isFixed) {
            x -= _getDocScrollLeft(ownerDoc);
            y += _getDocScrollTop(ownerDoc);
          }

          startElementX = self.x; //starting rotation (x always refers to rotation in type:"rotation", measured in degrees)

          startElementY = self.y = Math.atan2(y, x) * _RAD2DEG;
        } else {
          parent = !isFixed && target.parentNode;
          startScrollTop = parent ? parent.scrollTop || 0 : 0;
          startScrollLeft = parent ? parent.scrollLeft || 0 : 0;
          startElementY = getPropAsNum(yProp, "px"); //record the starting top and left values so that we can just add the mouse's movement to them later.

          startElementX = getPropAsNum(xProp, "px");
        }
      }

      if (hasBounds && edgeTolerance) {
        if (startElementX > maxX) {
          startElementX = maxX + (startElementX - maxX) / edgeTolerance;
        } else if (startElementX < minX) {
          startElementX = minX - (minX - startElementX) / edgeTolerance;
        }

        if (!rotationMode) {
          if (startElementY > maxY) {
            startElementY = maxY + (startElementY - maxY) / edgeTolerance;
          } else if (startElementY < minY) {
            startElementY = minY - (minY - startElementY) / edgeTolerance;
          }
        }
      }

      self.startX = startElementX;
      self.startY = startElementY;
    },
        isTweening = function isTweening() {
      return self.tween && self.tween.isActive();
    },
        removePlaceholder = function removePlaceholder() {
      if (_placeholderDiv.parentNode && !isTweening() && !self.isDragging) {
        //_placeholderDiv just props open auto-scrolling containers so they don't collapse as the user drags left/up. We remove it after dragging (and throwing, if necessary) finishes.
        _placeholderDiv.parentNode.removeChild(_placeholderDiv);
      }
    },
        //called when the mouse is pressed (or touch starts)
    onPress = function onPress(e, force) {
      var i;

      if (!enabled || self.isPressed || !e || (e.type === "mousedown" || e.type === "pointerdown") && !force && _getTime() - clickTime < 30 && _touchEventLookup[self.pointerEvent.type]) {
        //when we DON'T preventDefault() in order to accommodate touch-scrolling and the user just taps, many browsers also fire a mousedown/mouseup sequence AFTER the touchstart/touchend sequence, thus it'd result in two quick "click" events being dispatched. This line senses that condition and halts it on the subsequent mousedown.
        return;
      }

      interrupted = isTweening();
      self.pointerEvent = e;

      if (_touchEventLookup[e.type]) {
        //note: on iOS, BOTH touchmove and mousemove are dispatched, but the mousemove has pageY and pageX of 0 which would mess up the calculations and needlessly hurt performance.
        touchEventTarget = ~e.type.indexOf("touch") ? e.currentTarget || e.target : ownerDoc; //pointer-based touches (for Microsoft browsers) don't remain locked to the original target like other browsers, so we must use the document instead. The event type would be "MSPointerDown" or "pointerdown".

        _addListener(touchEventTarget, "touchend", onRelease);

        _addListener(touchEventTarget, "touchmove", onMove);

        _addListener(touchEventTarget, "touchcancel", onRelease);

        _addListener(ownerDoc, "touchstart", _onMultiTouchDocument);
      } else {
        touchEventTarget = null;

        _addListener(ownerDoc, "mousemove", onMove); //attach these to the document instead of the box itself so that if the user's mouse moves too quickly (and off of the box), things still work.

      }

      touchDragAxis = null;

      if (!_supportsPointer) {
        _addListener(ownerDoc, "mouseup", onRelease);

        if (e && e.target) {
          _addListener(e.target, "mouseup", onRelease); //we also have to listen directly on the element because some browsers don't bubble up the event to the _doc on elements with contentEditable="true"

        }
      }

      isClicking = isClickable.call(self, e.target) && vars.dragClickables === false && !force;

      if (isClicking) {
        _addListener(e.target, "change", onRelease); //in some browsers, when you mousedown on a <select> element, no mouseup gets dispatched! So we listen for a "change" event instead.


        _dispatchEvent(self, "pressInit", "onPressInit");

        _dispatchEvent(self, "press", "onPress");

        _setSelectable(triggers, true); //accommodates things like inputs and elements with contentEditable="true" (otherwise user couldn't drag to select text)


        return;
      }

      allowNativeTouchScrolling = !touchEventTarget || allowX === allowY || self.vars.allowNativeTouchScrolling === false || self.vars.allowContextMenu && e && (e.ctrlKey || e.which > 2) ? false : allowX ? "y" : "x"; //note: in Chrome, right-clicking (for a context menu) fires onPress and it doesn't have the event.which set properly, so we must look for event.ctrlKey. If the user wants to allow context menus we should of course sense it here and not allow native touch scrolling.

      if (!allowNativeTouchScrolling && !self.allowEventDefault) {
        _preventDefault(e);

        _addListener(_win, "touchforcechange", _preventDefault); //works around safari bug: https://greensock.com/forums/topic/21450-draggable-in-iframe-on-mobile-is-buggy/

      }

      if (e.changedTouches) {
        //touch events store the data slightly differently
        e = touch = e.changedTouches[0];
        touchID = e.identifier;
      } else if (e.pointerId) {
        touchID = e.pointerId; //for some Microsoft browsers
      } else {
        touch = touchID = null;
      }

      _dragCount++;

      _addToRenderQueue(render); //causes the Draggable to render on each "tick" of TweenLite.ticker (performance optimization - updating values in a mousemove can cause them to happen too frequently, like multiple times between frame redraws which is wasteful, and it also prevents values from updating properly in IE8)


      startPointerY = self.pointerY = e.pageY; //record the starting x and y so that we can calculate the movement from the original in _onMouseMove

      startPointerX = self.pointerX = e.pageX;

      _dispatchEvent(self, "pressInit", "onPressInit");

      if (allowNativeTouchScrolling || self.autoScroll) {
        _recordMaxScrolls(target.parentNode);
      }

      if (target.parentNode && self.autoScroll && !scrollProxy && !rotationMode && target.parentNode._gsMaxScrollX && !_placeholderDiv.parentNode && !target.getBBox) {
        //add a placeholder div to prevent the parent container from collapsing when the user drags the element left.
        _placeholderDiv.style.width = target.parentNode.scrollWidth + "px";
        target.parentNode.appendChild(_placeholderDiv);
      }

      recordStartPositions();

      if (self.tween) {
        self.tween.kill();
      }

      self.isThrowing = false;
      gsap.killTweensOf(scrollProxy || target, killProps, true); //in case the user tries to drag it before the last tween is done.

      if (scrollProxy) {
        gsap.killTweensOf(target, {
          scrollTo: 1
        }, true); //just in case the original target's scroll position is being tweened somewhere else.
      }

      self.tween = self.lockedAxis = null;

      if (vars.zIndexBoost || !rotationMode && !scrollProxy && vars.zIndexBoost !== false) {
        target.style.zIndex = Draggable.zIndex++;
      }

      self.isPressed = true;
      hasDragCallback = !!(vars.onDrag || self._listeners.drag);
      hasMoveCallback = !!(vars.onMove || self._listeners.move);

      if (!rotationMode && (vars.cursor !== false || vars.activeCursor)) {
        i = triggers.length;

        while (--i > -1) {
          //_setStyle(triggers[i], "cursor", vars.activeCursor || vars.cursor || (_defaultCursor === "grab" ? "grabbing" : _defaultCursor));
          gsap.set(triggers[i], {
            cursor: vars.activeCursor || vars.cursor || (_defaultCursor === "grab" ? "grabbing" : _defaultCursor)
          });
        }
      }

      _dispatchEvent(self, "press", "onPress");
    },
        //called every time the mouse/touch moves
    onMove = function onMove(e) {
      var originalEvent = e,
          touches,
          pointerX,
          pointerY,
          i,
          dx,
          dy;

      if (!enabled || _isMultiTouching || !self.isPressed || !e) {
        return;
      }

      self.pointerEvent = e;
      touches = e.changedTouches;

      if (touches) {
        //touch events store the data slightly differently
        e = touches[0];

        if (e !== touch && e.identifier !== touchID) {
          //Usually changedTouches[0] will be what we're looking for, but in case it's not, look through the rest of the array...(and Android browsers don't reuse the event like iOS)
          i = touches.length;

          while (--i > -1 && (e = touches[i]).identifier !== touchID) {}

          if (i < 0) {
            return;
          }
        }
      } else if (e.pointerId && touchID && e.pointerId !== touchID) {
        //for some Microsoft browsers, we must attach the listener to the doc rather than the trigger so that when the finger moves outside the bounds of the trigger, things still work. So if the event we're receiving has a pointerId that doesn't match the touchID, ignore it (for multi-touch)
        return;
      }

      if (touchEventTarget && allowNativeTouchScrolling && !touchDragAxis) {
        //Android browsers force us to decide on the first "touchmove" event if we should allow the default (scrolling) behavior or preventDefault(). Otherwise, a "touchcancel" will be fired and then no "touchmove" or "touchend" will fire during the scrolling (no good).
        _point1.x = e.pageX;
        _point1.y = e.pageY;

        if (matrix) {
          matrix.apply(_point1, _point1);
        }

        pointerX = _point1.x;
        pointerY = _point1.y;
        dx = Math.abs(pointerX - startPointerX);
        dy = Math.abs(pointerY - startPointerY);

        if (dx !== dy && (dx > minimumMovement || dy > minimumMovement) || _isAndroid && allowNativeTouchScrolling === touchDragAxis) {
          touchDragAxis = dx > dy && allowX ? "x" : "y";

          if (allowNativeTouchScrolling && touchDragAxis !== allowNativeTouchScrolling) {
            _addListener(_win, "touchforcechange", _preventDefault); // prevents native touch scrolling from taking over if the user started dragging in the other direction in iOS Safari

          }

          if (self.vars.lockAxisOnTouchScroll !== false) {
            self.lockedAxis = touchDragAxis === "x" ? "y" : "x";

            if (_isFunction(self.vars.onLockAxis)) {
              self.vars.onLockAxis.call(self, originalEvent);
            }
          }

          if (_isAndroid && allowNativeTouchScrolling === touchDragAxis) {
            onRelease(originalEvent);
            return;
          }
        }
      }

      if (!self.allowEventDefault && (!allowNativeTouchScrolling || touchDragAxis && allowNativeTouchScrolling !== touchDragAxis) && originalEvent.cancelable !== false) {
        _preventDefault(originalEvent);
      }

      if (self.autoScroll) {
        checkAutoScrollBounds = true;
      }

      setPointerPosition(e.pageX - (isFixed ? _getDocScrollLeft(ownerDoc) : 0), e.pageY - (isFixed ? _getDocScrollTop(ownerDoc) : 0), hasMoveCallback);
    },
        setPointerPosition = function setPointerPosition(pointerX, pointerY, invokeOnMove) {
      var dragTolerance = 1 - self.dragResistance,
          edgeTolerance = 1 - self.edgeResistance,
          prevPointerX = self.pointerX,
          prevPointerY = self.pointerY,
          prevStartElementY = startElementY,
          prevX = self.x,
          prevY = self.y,
          prevEndX = self.endX,
          prevEndY = self.endY,
          prevEndRotation = self.endRotation,
          prevDirty = dirty,
          xChange,
          yChange,
          x,
          y,
          dif,
          temp;
      self.pointerX = pointerX;
      self.pointerY = pointerY;

      if (rotationMode) {
        y = Math.atan2(rotationOrigin.y - pointerY, pointerX - rotationOrigin.x) * _RAD2DEG;
        dif = self.y - y;

        if (dif > 180) {
          startElementY -= 360;
          self.y = y;
        } else if (dif < -180) {
          startElementY += 360;
          self.y = y;
        }

        if (self.x !== startElementX || Math.abs(startElementY - y) > minimumMovement) {
          self.y = y;
          x = startElementX + (startElementY - y) * dragTolerance;
        } else {
          x = startElementX;
        }
      } else {
        if (matrix) {
          temp = pointerX * matrix.a + pointerY * matrix.c + matrix.e;
          pointerY = pointerX * matrix.b + pointerY * matrix.d + matrix.f;
          pointerX = temp;
        }

        yChange = pointerY - startPointerY;
        xChange = pointerX - startPointerX;

        if (yChange < minimumMovement && yChange > -minimumMovement) {
          yChange = 0;
        }

        if (xChange < minimumMovement && xChange > -minimumMovement) {
          xChange = 0;
        }

        if ((self.lockAxis || self.lockedAxis) && (xChange || yChange)) {
          temp = self.lockedAxis;

          if (!temp) {
            self.lockedAxis = temp = allowX && Math.abs(xChange) > Math.abs(yChange) ? "y" : allowY ? "x" : null;

            if (temp && _isFunction(self.vars.onLockAxis)) {
              self.vars.onLockAxis.call(self, self.pointerEvent);
            }
          }

          if (temp === "y") {
            yChange = 0;
          } else if (temp === "x") {
            xChange = 0;
          }
        }

        x = _round(startElementX + xChange * dragTolerance);
        y = _round(startElementY + yChange * dragTolerance);
      }

      if ((snapX || snapY || snapXY) && (self.x !== x || self.y !== y && !rotationMode)) {
        if (snapXY) {
          _temp1.x = x;
          _temp1.y = y;
          temp = snapXY(_temp1);
          x = _round(temp.x);
          y = _round(temp.y);
        }

        if (snapX) {
          x = _round(snapX(x));
        }

        if (snapY) {
          y = _round(snapY(y));
        }
      } else if (hasBounds) {
        if (x > maxX) {
          x = maxX + Math.round((x - maxX) * edgeTolerance);
        } else if (x < minX) {
          x = minX + Math.round((x - minX) * edgeTolerance);
        }

        if (!rotationMode) {
          if (y > maxY) {
            y = Math.round(maxY + (y - maxY) * edgeTolerance);
          } else if (y < minY) {
            y = Math.round(minY + (y - minY) * edgeTolerance);
          }
        }
      }

      if (self.x !== x || self.y !== y && !rotationMode) {
        if (rotationMode) {
          self.endRotation = self.x = self.endX = x;
          dirty = true;
        } else {
          if (allowY) {
            self.y = self.endY = y;
            dirty = true; //a flag that indicates we need to render the target next time the TweenLite.ticker dispatches a "tick" event (typically on a requestAnimationFrame) - this is a performance optimization (we shouldn't render on every move because sometimes many move events can get dispatched between screen refreshes, and that'd be wasteful to render every time)
          }

          if (allowX) {
            self.x = self.endX = x;
            dirty = true;
          }
        }

        if (!invokeOnMove || _dispatchEvent(self, "move", "onMove") !== false) {
          if (!self.isDragging && self.isPressed) {
            self.isDragging = true;

            _dispatchEvent(self, "dragstart", "onDragStart");
          }
        } else {
          //revert because the onMove returned false!
          self.pointerX = prevPointerX;
          self.pointerY = prevPointerY;
          startElementY = prevStartElementY;
          self.x = prevX;
          self.y = prevY;
          self.endX = prevEndX;
          self.endY = prevEndY;
          self.endRotation = prevEndRotation;
          dirty = prevDirty;
        }
      }
    },
        //called when the mouse/touch is released
    onRelease = function onRelease(e, force) {
      if (!enabled || !self.isPressed || e && touchID != null && !force && (e.pointerId && e.pointerId !== touchID || e.changedTouches && !_hasTouchID(e.changedTouches, touchID))) {
        //for some Microsoft browsers, we must attach the listener to the doc rather than the trigger so that when the finger moves outside the bounds of the trigger, things still work. So if the event we're receiving has a pointerId that doesn't match the touchID, ignore it (for multi-touch)
        return;
      }

      self.isPressed = false;
      var originalEvent = e,
          wasDragging = self.isDragging,
          isContextMenuRelease = self.vars.allowContextMenu && e && (e.ctrlKey || e.which > 2),
          placeholderDelayedCall = gsap.delayedCall(0.001, removePlaceholder),
          touches,
          i,
          syntheticEvent,
          eventTarget,
          syntheticClick;

      if (touchEventTarget) {
        _removeListener(touchEventTarget, "touchend", onRelease);

        _removeListener(touchEventTarget, "touchmove", onMove);

        _removeListener(touchEventTarget, "touchcancel", onRelease);

        _removeListener(ownerDoc, "touchstart", _onMultiTouchDocument);
      } else {
        _removeListener(ownerDoc, "mousemove", onMove);
      }

      _removeListener(_win, "touchforcechange", _preventDefault);

      if (!_supportsPointer) {
        _removeListener(ownerDoc, "mouseup", onRelease);

        if (e && e.target) {
          _removeListener(e.target, "mouseup", onRelease);
        }
      }

      dirty = false;

      if (isClicking && !isContextMenuRelease) {
        if (e) {
          _removeListener(e.target, "change", onRelease);

          self.pointerEvent = originalEvent;
        }

        _setSelectable(triggers, false);

        _dispatchEvent(self, "release", "onRelease");

        _dispatchEvent(self, "click", "onClick");

        isClicking = false;
        return;
      }

      _removeFromRenderQueue(render);

      if (!rotationMode) {
        i = triggers.length;

        while (--i > -1) {
          _setStyle(triggers[i], "cursor", vars.cursor || (vars.cursor !== false ? _defaultCursor : null));
        }
      }

      if (wasDragging) {
        dragEndTime = _lastDragTime = _getTime();
        self.isDragging = false;
      }

      _dragCount--;

      if (e) {
        touches = e.changedTouches;

        if (touches) {
          //touch events store the data slightly differently
          e = touches[0];

          if (e !== touch && e.identifier !== touchID) {
            //Usually changedTouches[0] will be what we're looking for, but in case it's not, look through the rest of the array...(and Android browsers don't reuse the event like iOS)
            i = touches.length;

            while (--i > -1 && (e = touches[i]).identifier !== touchID) {}

            if (i < 0) {
              return;
            }
          }
        }

        self.pointerEvent = originalEvent;
        self.pointerX = e.pageX;
        self.pointerY = e.pageY;
      }

      if (isContextMenuRelease && originalEvent) {
        _preventDefault(originalEvent);

        _dispatchEvent(self, "release", "onRelease");
      } else if (originalEvent && !wasDragging) {
        if (interrupted && (vars.snap || vars.bounds)) {
          //otherwise, if the user clicks on the object while it's animating to a snapped position, and then releases without moving 3 pixels, it will just stay there (it should animate/snap)
          animate(vars.inertia || vars.throwProps);
        }

        _dispatchEvent(self, "release", "onRelease");

        if ((!_isAndroid || originalEvent.type !== "touchmove") && originalEvent.type.indexOf("cancel") === -1) {
          //to accommodate native scrolling on Android devices, we have to immediately call onRelease() on the first touchmove event, but that shouldn't trigger a "click".
          _dispatchEvent(self, "click", "onClick");

          if (_getTime() - clickTime < 300) {
            _dispatchEvent(self, "doubleclick", "onDoubleClick");
          }

          eventTarget = originalEvent.target || target; //old IE uses srcElement

          clickTime = _getTime();

          syntheticClick = function syntheticClick() {
            // some browsers (like Firefox) won't trust script-generated clicks, so if the user tries to click on a video to play it, for example, it simply won't work. Since a regular "click" event will most likely be generated anyway (one that has its isTrusted flag set to true), we must slightly delay our script-generated click so that the "real"/trusted one is prioritized. Remember, when there are duplicate events in quick succession, we suppress all but the first one. Some browsers don't even trigger the "real" one at all, so our synthetic one is a safety valve that ensures that no matter what, a click event does get dispatched.
            if (clickTime !== clickDispatch && self.enabled() && !self.isPressed && !originalEvent.defaultPrevented) {
              if (eventTarget.click) {
                //some browsers (like mobile Safari) don't properly trigger the click event
                eventTarget.click();
              } else if (ownerDoc.createEvent) {
                syntheticEvent = ownerDoc.createEvent("MouseEvents");
                syntheticEvent.initMouseEvent("click", true, true, _win, 1, self.pointerEvent.screenX, self.pointerEvent.screenY, self.pointerX, self.pointerY, false, false, false, false, 0, null);
                eventTarget.dispatchEvent(syntheticEvent);
              }
            }
          };

          if (!_isAndroid && !originalEvent.defaultPrevented) {
            //iOS Safari requires the synthetic click to happen immediately or else it simply won't work, but Android doesn't play nice.
            gsap.delayedCall(0.05, syntheticClick); //in addition to the iOS bug workaround, there's a Firefox issue with clicking on things like a video to play, so we must fake a click event in a slightly delayed fashion. Previously, we listened for the "click" event with "capture" false which solved the video-click-to-play issue, but it would allow the "click" event to be dispatched twice like if you were using a jQuery.click() because that was handled in the capture phase, thus we had to switch to the capture phase to avoid the double-dispatching, but do the delayed synthetic click. Don't fire it too fast (like 0.00001) because we want to give the native event a chance to fire first as it's "trusted".
          }
        }
      } else {
        animate(vars.inertia || vars.throwProps); //will skip if inertia/throwProps isn't defined or IntertiaPlugin isn't loaded.

        if (!self.allowEventDefault && originalEvent && (vars.dragClickables !== false || !isClickable.call(self, originalEvent.target)) && wasDragging && (!allowNativeTouchScrolling || touchDragAxis && allowNativeTouchScrolling === touchDragAxis) && originalEvent.cancelable !== false) {
          _preventDefault(originalEvent);
        }

        _dispatchEvent(self, "release", "onRelease");
      }

      if (isTweening()) {
        placeholderDelayedCall.duration(self.tween.duration()); //sync the timing so that the placeholder DIV gets
      }

      if (wasDragging) {
        _dispatchEvent(self, "dragend", "onDragEnd");
      }

      return true;
    },
        updateScroll = function updateScroll(e) {
      if (e && self.isDragging && !scrollProxy) {
        var parent = e.target || target.parentNode,
            deltaX = parent.scrollLeft - parent._gsScrollX,
            deltaY = parent.scrollTop - parent._gsScrollY;

        if (deltaX || deltaY) {
          if (matrix) {
            startPointerX -= deltaX * matrix.a + deltaY * matrix.c;
            startPointerY -= deltaY * matrix.d + deltaX * matrix.b;
          } else {
            startPointerX -= deltaX;
            startPointerY -= deltaY;
          }

          parent._gsScrollX += deltaX;
          parent._gsScrollY += deltaY;
          setPointerPosition(self.pointerX, self.pointerY);
        }
      }
    },
        onClick = function onClick(e) {
      //this was a huge pain in the neck to align all the various browsers and their behaviors. Chrome, Firefox, Safari, Opera, Android, and Microsoft Edge all handle events differently! Some will only trigger native behavior (like checkbox toggling) from trusted events. Others don't even support isTrusted, but require 2 events to flow through before triggering native behavior. Edge treats everything as trusted but also mandates that 2 flow through to trigger the correct native behavior.
      var time = _getTime(),
          recentlyClicked = time - clickTime < 40,
          recentlyDragged = time - dragEndTime < 40,
          alreadyDispatched = recentlyClicked && clickDispatch === clickTime,
          defaultPrevented = self.pointerEvent && self.pointerEvent.defaultPrevented,
          alreadyDispatchedTrusted = recentlyClicked && trustedClickDispatch === clickTime,
          trusted = e.isTrusted || e.isTrusted == null && recentlyClicked && alreadyDispatched; //note: Safari doesn't support isTrusted, and it won't properly execute native behavior (like toggling checkboxes) on the first synthetic "click" event - we must wait for the 2nd and treat it as trusted (but stop propagation at that point). Confusing, I know. Don't you love cross-browser compatibility challenges?


      if ((alreadyDispatched || recentlyDragged && self.vars.suppressClickOnDrag !== false) && e.stopImmediatePropagation) {
        e.stopImmediatePropagation();
      }

      if (recentlyClicked && !(self.pointerEvent && self.pointerEvent.defaultPrevented) && (!alreadyDispatched || trusted && !alreadyDispatchedTrusted)) {
        //let the first click pass through unhindered. Let the next one only if it's trusted, then no more (stop quick-succession ones)
        if (trusted && alreadyDispatched) {
          trustedClickDispatch = clickTime;
        }

        clickDispatch = clickTime;
        return;
      }

      if (self.isPressed || recentlyDragged || recentlyClicked) {
        if (!trusted || !e.detail || !recentlyClicked || defaultPrevented) {
          _preventDefault(e);
        }
      }
    },
        localizePoint = function localizePoint(p) {
      return matrix ? {
        x: p.x * matrix.a + p.y * matrix.c + matrix.e,
        y: p.x * matrix.b + p.y * matrix.d + matrix.f
      } : {
        x: p.x,
        y: p.y
      };
    };

    old = Draggable.get(target);

    if (old) {
      old.kill(); // avoids duplicates (an element can only be controlled by one Draggable)
    } //give the user access to start/stop dragging...


    _this2.startDrag = function (event, align) {
      var r1, r2, p1, p2;
      onPress(event || self.pointerEvent, true); //if the pointer isn't on top of the element, adjust things accordingly

      if (align && !self.hitTest(event || self.pointerEvent)) {
        r1 = _parseRect(event || self.pointerEvent);
        r2 = _parseRect(target);
        p1 = localizePoint({
          x: r1.left + r1.width / 2,
          y: r1.top + r1.height / 2
        });
        p2 = localizePoint({
          x: r2.left + r2.width / 2,
          y: r2.top + r2.height / 2
        });
        startPointerX -= p1.x - p2.x;
        startPointerY -= p1.y - p2.y;
      }

      if (!self.isDragging) {
        self.isDragging = true;

        _dispatchEvent(self, "dragstart", "onDragStart");
      }
    };

    _this2.drag = onMove;

    _this2.endDrag = function (e) {
      return onRelease(e || self.pointerEvent, true);
    };

    _this2.timeSinceDrag = function () {
      return self.isDragging ? 0 : (_getTime() - dragEndTime) / 1000;
    };

    _this2.timeSinceClick = function () {
      return (_getTime() - clickTime) / 1000;
    };

    _this2.hitTest = function (target, threshold) {
      return Draggable.hitTest(self.target, target, threshold);
    };

    _this2.getDirection = function (from, diagonalThreshold) {
      //from can be "start" (default), "velocity", or an element
      var mode = from === "velocity" && InertiaPlugin ? from : _isObject(from) && !rotationMode ? "element" : "start",
          xChange,
          yChange,
          ratio,
          direction,
          r1,
          r2;

      if (mode === "element") {
        r1 = _parseRect(self.target);
        r2 = _parseRect(from);
      }

      xChange = mode === "start" ? self.x - startElementX : mode === "velocity" ? InertiaPlugin.getVelocity(target, xProp) : r1.left + r1.width / 2 - (r2.left + r2.width / 2);

      if (rotationMode) {
        return xChange < 0 ? "counter-clockwise" : "clockwise";
      } else {
        diagonalThreshold = diagonalThreshold || 2;
        yChange = mode === "start" ? self.y - startElementY : mode === "velocity" ? InertiaPlugin.getVelocity(target, yProp) : r1.top + r1.height / 2 - (r2.top + r2.height / 2);
        ratio = Math.abs(xChange / yChange);
        direction = ratio < 1 / diagonalThreshold ? "" : xChange < 0 ? "left" : "right";

        if (ratio < diagonalThreshold) {
          if (direction !== "") {
            direction += "-";
          }

          direction += yChange < 0 ? "up" : "down";
        }
      }

      return direction;
    };

    _this2.applyBounds = function (newBounds, sticky) {
      var x, y, forceZeroVelocity, e, parent, isRoot;

      if (newBounds && vars.bounds !== newBounds) {
        vars.bounds = newBounds;
        return self.update(true, sticky);
      }

      syncXY(true);
      calculateBounds();

      if (hasBounds && !isTweening()) {
        x = self.x;
        y = self.y;

        if (x > maxX) {
          x = maxX;
        } else if (x < minX) {
          x = minX;
        }

        if (y > maxY) {
          y = maxY;
        } else if (y < minY) {
          y = minY;
        }

        if (self.x !== x || self.y !== y) {
          forceZeroVelocity = true;
          self.x = self.endX = x;

          if (rotationMode) {
            self.endRotation = x;
          } else {
            self.y = self.endY = y;
          }

          dirty = true;
          render(true);

          if (self.autoScroll && !self.isDragging) {
            _recordMaxScrolls(target.parentNode);

            e = target;
            _windowProxy.scrollTop = _win.pageYOffset != null ? _win.pageYOffset : ownerDoc.documentElement.scrollTop != null ? ownerDoc.documentElement.scrollTop : ownerDoc.body.scrollTop;
            _windowProxy.scrollLeft = _win.pageXOffset != null ? _win.pageXOffset : ownerDoc.documentElement.scrollLeft != null ? ownerDoc.documentElement.scrollLeft : ownerDoc.body.scrollLeft;

            while (e && !isRoot) {
              //walk up the chain and sense wherever the scrollTop/scrollLeft exceeds the maximum.
              isRoot = _isRoot(e.parentNode);
              parent = isRoot ? _windowProxy : e.parentNode;

              if (allowY && parent.scrollTop > parent._gsMaxScrollY) {
                parent.scrollTop = parent._gsMaxScrollY;
              }

              if (allowX && parent.scrollLeft > parent._gsMaxScrollX) {
                parent.scrollLeft = parent._gsMaxScrollX;
              }

              e = parent;
            }
          }
        }

        if (self.isThrowing && (forceZeroVelocity || self.endX > maxX || self.endX < minX || self.endY > maxY || self.endY < minY)) {
          animate(vars.inertia || vars.throwProps, forceZeroVelocity);
        }
      }

      return self;
    };

    _this2.update = function (applyBounds, sticky, ignoreExternalChanges) {
      var x = self.x,
          y = self.y;
      updateMatrix(!sticky);

      if (applyBounds) {
        self.applyBounds();
      } else {
        if (dirty && ignoreExternalChanges) {
          render(true);
        }

        syncXY(true);
      }

      if (sticky) {
        setPointerPosition(self.pointerX, self.pointerY);

        if (dirty) {
          render(true);
        }
      }

      if (self.isPressed && !sticky && (allowX && Math.abs(x - self.x) > 0.01 || allowY && Math.abs(y - self.y) > 0.01 && !rotationMode)) {
        recordStartPositions();
      }

      if (self.autoScroll) {
        _recordMaxScrolls(target.parentNode);

        checkAutoScrollBounds = self.isDragging;
        render(true); //in case reparenting occurred.

        _removeScrollListener(target, updateScroll);

        _addScrollListener(target, updateScroll);
      }

      return self;
    };

    _this2.enable = function (type) {
      var setVars = {
        lazy: true
      },
          id,
          i,
          trigger;

      if (!rotationMode && vars.cursor !== false) {
        setVars.cursor = vars.cursor || _defaultCursor;
      }

      if (gsap.utils.checkPrefix("touchCallout")) {
        setVars.touchCallout = "none";
      }

      setVars.touchAction = allowX === allowY ? "none" : vars.allowNativeTouchScrolling || vars.allowEventDefault ? "manipulation" : allowX ? "pan-y" : "pan-x";

      if (type !== "soft") {
        i = triggers.length;

        while (--i > -1) {
          trigger = triggers[i];

          if (!_supportsPointer) {
            _addListener(trigger, "mousedown", onPress);
          }

          _addListener(trigger, "touchstart", onPress);

          _addListener(trigger, "click", onClick, true); //note: used to pass true for capture but it prevented click-to-play-video functionality in Firefox.


          gsap.set(trigger, setVars);

          if (trigger.getBBox && trigger.ownerSVGElement) {
            // a bug in chrome doesn't respect touch-action on SVG elements - it only works if we set it on the parent SVG.
            gsap.set(trigger.ownerSVGElement, {
              touchAction: allowX === allowY ? "none" : vars.allowNativeTouchScrolling || vars.allowEventDefault ? "manipulation" : allowX ? "pan-y" : "pan-x"
            });
          }

          if (!vars.allowContextMenu) {
            _addListener(trigger, "contextmenu", onContextMenu);
          }
        }

        _setSelectable(triggers, false);
      }

      _addScrollListener(target, updateScroll);

      enabled = true;

      if (InertiaPlugin && type !== "soft") {
        InertiaPlugin.track(scrollProxy || target, xyMode ? "x,y" : rotationMode ? "rotation" : "top,left");
      }

      target._gsDragID = id = "d" + _lookupCount++;
      _lookup[id] = self;

      if (scrollProxy) {
        scrollProxy.enable();
        scrollProxy.element._gsDragID = id;
      }

      if (vars.bounds) {
        recordStartPositions();
        self.applyBounds();
      }

      return self;
    };

    _this2.disable = function (type) {
      var dragging = self.isDragging,
          i,
          trigger;

      if (!rotationMode) {
        i = triggers.length;

        while (--i > -1) {
          _setStyle(triggers[i], "cursor", null);
        }
      }

      if (type !== "soft") {
        i = triggers.length;

        while (--i > -1) {
          trigger = triggers[i];

          _setStyle(trigger, "touchCallout", null);

          _setStyle(trigger, "touchAction", null);

          _removeListener(trigger, "mousedown", onPress);

          _removeListener(trigger, "touchstart", onPress);

          _removeListener(trigger, "click", onClick);

          _removeListener(trigger, "contextmenu", onContextMenu);
        }

        _setSelectable(triggers, true);

        if (touchEventTarget) {
          _removeListener(touchEventTarget, "touchcancel", onRelease);

          _removeListener(touchEventTarget, "touchend", onRelease);

          _removeListener(touchEventTarget, "touchmove", onMove);
        }

        _removeListener(ownerDoc, "mouseup", onRelease);

        _removeListener(ownerDoc, "mousemove", onMove);
      }

      _removeScrollListener(target, updateScroll);

      enabled = false;

      if (InertiaPlugin && type !== "soft") {
        InertiaPlugin.untrack(scrollProxy || target, xyMode ? "x,y" : rotationMode ? "rotation" : "top,left");
      }

      if (scrollProxy) {
        scrollProxy.disable();
      }

      _removeFromRenderQueue(render);

      self.isDragging = self.isPressed = isClicking = false;

      if (dragging) {
        _dispatchEvent(self, "dragend", "onDragEnd");
      }

      return self;
    };

    _this2.enabled = function (value, type) {
      return arguments.length ? value ? self.enable(type) : self.disable(type) : enabled;
    };

    _this2.kill = function () {
      self.isThrowing = false;

      if (self.tween) {
        self.tween.kill();
      }

      self.disable();
      gsap.set(triggers, {
        clearProps: "userSelect"
      });
      delete _lookup[target._gsDragID];
      return self;
    };

    if (~type.indexOf("scroll")) {
      scrollProxy = _this2.scrollProxy = new ScrollProxy(target, _extend({
        onKill: function onKill() {
          //ScrollProxy's onKill() gets called if/when the ScrollProxy senses that the user interacted with the scroll position manually (like using the scrollbar). IE9 doesn't fire the "mouseup" properly when users drag the scrollbar of an element, so this works around that issue.
          if (self.isPressed) {
            onRelease(null);
          }
        }
      }, vars)); //a bug in many Android devices' stock browser causes scrollTop to get forced back to 0 after it is altered via JS, so we set overflow to "hidden" on mobile/touch devices (they hide the scroll bar anyway). That works around the bug. (This bug is discussed at https://code.google.com/p/android/issues/detail?id=19625)

      target.style.overflowY = allowY && !_isTouchDevice ? "auto" : "hidden";
      target.style.overflowX = allowX && !_isTouchDevice ? "auto" : "hidden";
      target = scrollProxy.content;
    }

    if (rotationMode) {
      killProps.rotation = 1;
    } else {
      if (allowX) {
        killProps[xProp] = 1;
      }

      if (allowY) {
        killProps[yProp] = 1;
      }
    }

    gsCache.force3D = "force3D" in vars ? vars.force3D : true; //otherwise, normal dragging would be in 2D and then as soon as it's released and there's an inertia tween, it'd jump to 3D which can create an initial jump due to the work the browser must to do layerize it.

    _this2.enable();

    return _this2;
  }

  Draggable.register = function register(core) {
    gsap = core;

    _initCore();
  };

  Draggable.create = function create(targets, vars) {
    if (!_coreInitted) {
      _initCore(true);
    }

    return _toArray(targets).map(function (target) {
      return new Draggable(target, vars);
    });
  };

  Draggable.get = function get(target) {
    return _lookup[(_toArray(target)[0] || {})._gsDragID];
  };

  Draggable.timeSinceDrag = function timeSinceDrag() {
    return (_getTime() - _lastDragTime) / 1000;
  };

  Draggable.hitTest = function hitTest(obj1, obj2, threshold) {
    if (obj1 === obj2) {
      return false;
    }

    var r1 = _parseRect(obj1),
        r2 = _parseRect(obj2),
        top = r1.top,
        left = r1.left,
        right = r1.right,
        bottom = r1.bottom,
        width = r1.width,
        height = r1.height,
        isOutside = r2.left > right || r2.right < left || r2.top > bottom || r2.bottom < top,
        overlap,
        area,
        isRatio;

    if (isOutside || !threshold) {
      return !isOutside;
    }

    isRatio = (threshold + "").indexOf("%") !== -1;
    threshold = parseFloat(threshold) || 0;
    overlap = {
      left: Math.max(left, r2.left),
      top: Math.max(top, r2.top)
    };
    overlap.width = Math.min(right, r2.right) - overlap.left;
    overlap.height = Math.min(bottom, r2.bottom) - overlap.top;

    if (overlap.width < 0 || overlap.height < 0) {
      return false;
    }

    if (isRatio) {
      threshold *= 0.01;
      area = overlap.width * overlap.height;
      return area >= width * height * threshold || area >= r2.width * r2.height * threshold;
    }

    return overlap.width > threshold && overlap.height > threshold;
  };

  return Draggable;
}(EventDispatcher);

_setDefaults(Draggable.prototype, {
  pointerX: 0,
  pointerY: 0,
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0,
  isDragging: false,
  isPressed: false
});

Draggable.zIndex = 1000;
Draggable.version = "3.1.1";
_getGSAP() && gsap.registerPlugin(Draggable);


/***/ }),

/***/ "./node_modules/gsap/GSDevTools.js":
/*!*****************************************!*\
  !*** ./node_modules/gsap/GSDevTools.js ***!
  \*****************************************/
/*! exports provided: GSDevTools, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GSDevTools", function() { return GSDevTools; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return GSDevTools; });
/* harmony import */ var _Draggable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Draggable.js */ "./node_modules/gsap/Draggable.js");
/*!
 * GSDevTools 3.1.1
 * https://greensock.com
 *
 * @license Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */


var gsap,
    _coreInitted,
    _doc,
    _docEl,
    _win,
    _recordedRoot,
    Animation,
    _rootTween,
    _rootInstance,
    _rootIsDirty,
    _keyboardInstance,
    _globalTimeline,
    _independentRoot,
    _delayedCall,
    _recording = true,
    _startupPhase = true,
    //for the first 2 seconds, we don't record any zero-duration tweens because they're typically just setup stuff and/or the "from" or "startAt" tweens. In version 1.20.3 we started flagging those with data:"isStart"|"isFromStart" but this logic helps GSDevTools work with older versions too.
_globalStartTime = 0,
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _getGSAP = function _getGSAP() {
  return gsap || _windowExists() && (gsap = window.gsap) && gsap.registerPlugin && gsap;
},
    _isString = function _isString(value) {
  return typeof value === "string";
},
    _isFunction = function _isFunction(value) {
  return typeof value === "function";
},
    _isObject = function _isObject(value) {
  return typeof value === "object";
},
    _isUndefined = function _isUndefined(value) {
  return typeof value === "undefined";
},
    _bonusValidated = 1,
    //<name>GSDevTools</name>
_svgNS = "http://www.w3.org/2000/svg",
    _domNS = "http://www.w3.org/1999/xhtml",
    _idSeed = 0,
    //we assign an ID to each GSDevTools instance so that we can segregate the sessionStorage data accordingly.
_lookup = {},
    _supportsStorage = function () {
  try {
    sessionStorage.setItem("gsTest", "1");
    sessionStorage.removeItem("gsTest");
    return true;
  } catch (e) {
    return false;
  }
}(),
    _parseAnimation = function _parseAnimation(animationOrId) {
  return animationOrId instanceof Animation ? animationOrId : animationOrId ? gsap.getById(animationOrId) : null;
},
    _createElement = function _createElement(type, container, cssText) {
  var element = _doc.createElementNS ? _doc.createElementNS(type === "svg" ? _svgNS : _domNS, type) : _doc.createElement(type);

  if (container) {
    if (_isString(container)) {
      container = _doc.querySelector(container);
    }

    container.appendChild(element);
  }

  if (type === "svg") {
    element.setAttribute("xmlns", _svgNS);
    element.setAttribute("xmlns:xlink", _domNS);
  }

  if (cssText) {
    element.style.cssText = cssText;
  }

  return element;
},
    _clearSelection = function _clearSelection() {
  if (_doc.selection) {
    _doc.selection.empty();
  } else if (_win.getSelection) {
    _win.getSelection().removeAllRanges();
  }
},
    _getChildrenOf = function _getChildrenOf(timeline, includeTimelines) {
  var a = [],
      cnt = 0,
      Tween = gsap.core.Tween,
      tween = timeline._first;

  while (tween) {
    if (tween instanceof Tween) {
      if (tween.vars.id) {
        a[cnt++] = tween;
      }
    } else {
      if (includeTimelines && tween.vars.id) {
        a[cnt++] = tween;
      }

      a = a.concat(_getChildrenOf(tween, includeTimelines));
      cnt = a.length;
    }

    tween = tween._next;
  }

  return a;
},
    _getClippedDuration = function _getClippedDuration(animation, excludeRootRepeats) {
  var max = 0,
      repeat = Math.max(0, animation._repeat),
      t = animation._first;

  if (!t) {
    max = animation.duration();
  }

  while (t) {
    max = Math.max(max, t.totalDuration() > 999 ? t.endTime(false) : t._start + t._tDur / t._ts);
    t = t._next;
  }

  return !excludeRootRepeats && repeat ? max * (repeat + 1) + animation._rDelay * repeat : max;
},
    _globalizeTime = function _globalizeTime(animation, rawTime) {
  var a = animation,
      time = arguments.length > 1 ? +rawTime : a.rawTime();

  while (a) {
    time = a._start + time / (a._ts || 1);
    a = a.parent;
  }

  return time;
},
    _timeToProgress = function _timeToProgress(time, animation, defaultValue, relativeProgress) {
  var add, i, a;

  if (_isString(time)) {
    if (time.charAt(1) === "=") {
      add = parseInt(time.charAt(0) + "1", 10) * parseFloat(time.substr(2));

      if (add < 0 && relativeProgress === 0) {
        //if something like inTime:"-=2", we measure it from the END, not the beginning
        relativeProgress = 100;
      }

      time = relativeProgress / 100 * animation.duration() + add;
    } else if (isNaN(time) && animation.labels && animation.labels[time] !== -1) {
      time = animation.labels[time];
    } else if (animation === _recordedRoot) {
      //perhaps they defined an id of an animation, like "myAnimation+=2"
      i = time.indexOf("=");

      if (i > 0) {
        add = parseInt(time.charAt(i - 1) + "1", 10) * parseFloat(time.substr(i + 1));
        time = time.substr(0, i - 1);
      } else {
        add = 0;
      }

      a = gsap.getById(time);

      if (a) {
        time = _globalizeTime(a, defaultValue / 100 * a.duration()) + add;
      }
    }
  }

  time = isNaN(time) ? defaultValue : parseFloat(time);
  return Math.min(100, Math.max(0, time / animation.duration() * 100));
},
    _addedCSS,
    _createRootElement = function _createRootElement(element, minimal, css) {
  if (!_addedCSS) {
    _createElement("style", _docEl).innerHTML = '.gs-dev-tools{height:51px;bottom:0;left:0;right:0;display:block;position:fixed;overflow:visible;padding:0}.gs-dev-tools *{box-sizing:content-box;visibility:visible}.gs-dev-tools .gs-top{position:relative;z-index:499}.gs-dev-tools .gs-bottom{display:flex;align-items:center;justify-content:space-between;background-color:rgba(0,0,0,.6);height:42px;border-top:1px solid #999;position:relative}.gs-dev-tools .timeline{position:relative;height:8px;margin-left:15px;margin-right:15px;overflow:visible}.gs-dev-tools .progress-bar,.gs-dev-tools .timeline-track{height:8px;width:100%;position:absolute;top:0;left:0}.gs-dev-tools .timeline-track{background-color:#999;opacity:.6}.gs-dev-tools .progress-bar{background-color:#91e600;height:8px;top:0;width:0;pointer-events:none}.gs-dev-tools .seek-bar{width:100%;position:absolute;height:24px;top:-12px;left:0;background-color:transparent}.gs-dev-tools .in-point,.gs-dev-tools .out-point{width:15px;height:26px;position:absolute;top:-18px}.gs-dev-tools .in-point-shape{fill:#6d9900;stroke:rgba(0,0,0,.5);stroke-width:1}.gs-dev-tools .out-point-shape{fill:#994242;stroke:rgba(0,0,0,.5);stroke-width:1}.gs-dev-tools .in-point{transform:translateX(-100%)}.gs-dev-tools .out-point{left:100%}.gs-dev-tools .grab{stroke:rgba(255,255,255,.3);stroke-width:1}.gs-dev-tools .playhead{position:absolute;top:-5px;transform:translate(-50%,0);left:0;border-radius:50%;width:16px;height:16px;border:1px solid #6d9900;background-color:#91e600}.gs-dev-tools .gs-btn-white{fill:#fff}.gs-dev-tools .pause{opacity:0}.gs-dev-tools .select-animation{vertical-align:middle;position:relative;padding:6px 10px}.gs-dev-tools .select-animation-container{flex-grow:4;width:40%}.gs-dev-tools .select-arrow{display:inline-block;width:12px;height:7px;margin:0 7px;transform:translate(0,-2px)}.gs-dev-tools .select-arrow-shape{stroke:rgba(255,255,255,.6);stroke-width:2px;fill:none}.gs-dev-tools .rewind{height:16px;width:19px;padding:10px 4px;min-width:24px}.gs-dev-tools .rewind-path{opacity:.6}.gs-dev-tools .play-pause{width:24px;height:24px;padding:6px 10px;min-width:24px}.gs-dev-tools .ease{width:30px;height:30px;padding:10px;min-width:30px;display:none}.gs-dev-tools .ease-path{fill:none;stroke:rgba(255,255,255,.6);stroke-width:2px}.gs-dev-tools .ease-border{fill:rgba(255,255,255,.25)}.gs-dev-tools .time-scale{font-family:monospace;font-size:18px;text-align:center;color:rgba(255,255,255,.6);padding:4px 4px 4px 0;min-width:30px;margin-left:7px}.gs-dev-tools .loop{width:20px;padding:5px;min-width:20px}.gs-dev-tools .loop-path{fill:rgba(255,255,255,.6)}.gs-dev-tools label span{color:#fff;font-family:monospace;text-decoration:none;font-size:16px;line-height:18px}.gs-dev-tools .time-scale span{color:rgba(255,255,255,.6)}.gs-dev-tools button:focus,.gs-dev-tools select:focus{outline:0}.gs-dev-tools label{position:relative;cursor:pointer}.gs-dev-tools label.locked{text-decoration:none;cursor:auto}.gs-dev-tools label input,.gs-dev-tools label select{position:absolute;left:0;top:0;z-index:1;font:inherit;font-size:inherit;line-height:inherit;height:100%;width:100%;color:#000!important;opacity:0;background:0 0;border:none;padding:0;margin:0;-webkit-appearance:none;-moz-appearance:none;appearance:none;cursor:pointer}.gs-dev-tools label input+.display{position:relative;z-index:2}.gs-dev-tools .gs-bottom-right{vertical-align:middle;display:flex;align-items:center;flex-grow:4;width:40%;justify-content:flex-end}.gs-dev-tools .time-container{font-size:18px;font-family:monospace;color:rgba(255,255,255,.6);margin:0 5px}.gs-dev-tools .logo{width:32px;height:32px;position:relative;top:2px;margin:0 12px}.gs-dev-tools .gs-hit-area{background-color:transparent;width:100%;height:100%;top:0;position:absolute}.gs-dev-tools.minimal{height:auto;display:flex;align-items:stretch}.gs-dev-tools.minimal .gs-top{order:2;flex-grow:4;background-color:rgba(0,0,0,1)}.gs-dev-tools.minimal .gs-bottom{background-color:rgba(0,0,0,1);border-top:none}.gs-dev-tools.minimal .timeline{top:50%;transform:translate(0,-50%)}.gs-dev-tools.minimal .in-point,.gs-dev-tools.minimal .out-point{display:none}.gs-dev-tools.minimal .select-animation-container{display:none}.gs-dev-tools.minimal .rewind{display:none}.gs-dev-tools.minimal .play-pause{width:20px;height:20px;padding:4px 6px;margin-left:14px}.gs-dev-tools.minimal .time-scale{min-width:26px}.gs-dev-tools.minimal .loop{width:18px;min-width:18px;display:none}.gs-dev-tools.minimal .gs-bottom-right{display:none}@media only screen and (max-width:600px){.gs-dev-tools{height:auto;display:flex;align-items:stretch}.gs-dev-tools .gs-top{order:2;flex-grow:4;background-color:rgba(0,0,0,1);height:42px}.gs-dev-tools .gs-bottom{background-color:rgba(0,0,0,1);border-top:none}.gs-dev-tools .timeline{top:50%;transform:translate(0,-50%)}.gs-dev-tools .in-point,.gs-dev-tools .out-point{display:none}.gs-dev-tools .select-animation-container{display:none}.gs-dev-tools .rewind{display:none}.gs-dev-tools .play-pause{width:20px;height:20px;padding:4px 6px;margin-left:14px}.gs-dev-tools .time-scale{min-width:26px}.gs-dev-tools .loop{width:18px;min-width:18px;display:none}.gs-dev-tools .gs-bottom-right{display:none}}';
    _addedCSS = true;
  }

  if (_isString(element)) {
    element = _doc.querySelector(element);
  }

  var root = _createElement("div", element || _docEl.getElementsByTagName("body")[0] || _docEl);

  root.setAttribute("class", "gs-dev-tools" + (minimal ? " minimal" : ""));
  root.innerHTML = '<div class=gs-hit-area></div><div class=gs-top><div class=timeline><div class=timeline-track></div><div class=progress-bar></div><div class=seek-bar></div><svg class=in-point viewBox="0 0 15 26"xmlns=http://www.w3.org/2000/svg><polygon class=in-point-shape points=".5 .5 14.5 .5 14.5 25.5 .5 17.5"/><polyline class=grab points="5.5 4 5.5 15"/><polyline class=grab points="9.5 4 9.5 17"/></svg> <svg class=out-point viewBox="0 0 15 26"xmlns=http://www.w3.org/2000/svg><polygon class=out-point-shape points=".5 .5 14.5 .5 14.5 17.5 .5 25.5"/><polyline class=grab points="5.5 4 5.5 17"/><polyline class=grab points="9.5 4 9.5 15"/></svg><div class=playhead></div></div></div><div class=gs-bottom><div class=select-animation-container><label class=select-animation><select class=animation-list><option>Global Timeline<option>myTimeline</select><nobr><span class="display animation-label">Global Timeline</span> <svg class=select-arrow viewBox="0 0 12.05 6.73"xmlns=http://www.w3.org/2000/svg><polyline class=select-arrow-shape points="0.35 0.35 6.03 6.03 11.7 0.35"/></svg></nobr></label></div><svg class=rewind viewBox="0 0 12 15.38"xmlns=http://www.w3.org/2000/svg><path d=M0,.38H2v15H0Zm2,7,10,7.36V0Z class="gs-btn-white rewind-path"/></svg> <svg class=play-pause viewBox="0 0 20.97 25.67"xmlns=http://www.w3.org/2000/svg><g class=play><path d="M8,4.88 C8,10.18 8,15.48 8,20.79 5.33,22.41 2.66,24.04 0,25.67 0,17.11 0,8.55 0,0 2.66,1.62 5.33,3.25 8,4.88"class="gs-btn-white play-1"style=stroke:#fff;stroke-width:.6px /><path d="M14.485,8.855 C16.64,10.18 18.8,11.5 20.97,12.83 16.64,15.48 12.32,18.13 8,20.79 8,15.48 8,10.18 8,4.88 10.16,6.2 12.32,7.53 14.48,8.85"class="gs-btn-white play-2"style=stroke:#fff;stroke-width:.6px /></g></svg> <svg class=loop viewBox="0 0 29 25.38"xmlns=http://www.w3.org/2000/svg><path d=M27.44,5.44,20.19,0V3.06H9.06A9.31,9.31,0,0,0,0,12.41,9.74,9.74,0,0,0,.69,16l3.06-2.23a6,6,0,0,1-.12-1.22,5.49,5.49,0,0,1,5.43-5.5H20.19v3.81Z class=loop-path /><path d=M25.25,11.54a5.18,5.18,0,0,1,.12,1.12,5.41,5.41,0,0,1-5.43,5.41H9.19V14.5L1.94,19.94l7.25,5.44V22.06H19.94A9.2,9.2,0,0,0,29,12.84a9.42,9.42,0,0,0-.68-3.53Z class=loop-path /></svg> <svg class=ease viewBox="0 0 25.67 25.67"xmlns=http://www.w3.org/2000/svg><path d=M.48,25.12c1.74-3.57,4.28-12.6,8.8-10.7s4.75,1.43,6.5-1.11S19.89,1.19,25.2.55 class=ease-path /><path d=M24.67,1V24.67H1V1H24.67m1-1H0V25.67H25.67V0Z class=ease-border /></svg><label class=time-scale><select><option value=10>10x<option value=5>5x<option value=2>2x<option value=1 selected>1x<option value=0.5>0.5x<option value=0.25>0.25x<option value=0.1>0.1x</select><span class="display time-scale-label">1x</span></label><div class=gs-bottom-right><div class=time-container><span class=time>0.00</span> / <span class=duration>0.00</span></div><a href="https://greensock.com/docs/v3/Plugins/GSDevTools?source=GSDevTools"target=_blank title=Docs><svg class=logo viewBox="0 0 100 100"xmlns=http://www.w3.org/2000/svg><path d="M60 15.4c-.3-.4-.5-.6-.5-.7.1-.6.2-1 .2-1.7v-.4c.6.6 1.3 1.3 1.8 1.7.2.2.5.3.8.3.2 0 .3 0 .5.1h1.6c.8 0 1.6.1 2 0 .1 0 .2 0 .3-.1.6-.3 1.4-1 2.1-1.6 0 .6.1 1.2.1 1.7v1.5c0 .3 0 .5.1.7-.1.1-.2.1-.4.2-.7.4-1.7 1-2.3.9-.5-.1-1.5-.3-2.6-.7-1.2-.3-2.4-.8-3.2-1.2 0 0-.1 0-.1-.1s-.2-.4-.4-.6zm24.6 21.9c-.5-1.7-1.9-2-4.2-.7.9-1.5 2.1-1.5 2.3-2.1.9-2.5-.6-4.6-1.2-5.3.7-1.8 1.4-4.5-1-6.8-1-1-2.4-1.2-3.6-1.1 1.8 1.7 3.4 4.4 2.5 7.2-.1.3-.9.7-1.7 1 0 0 .4 2-.3 3.5-.3.6-.8 1.5-1.3 2.6 1 .9 1.6 1 3 1.3-.9.1-1.2.4-1.2.5-.7 3 1 3.4 1.4 4.8 0 .1 0 .2.1.3v.4c-.3.3-1.4.5-2.5.5s-1.8 1-1.8 1c-.2.1-.3.3-.4.4v1c0 .1 0 .4.1.6.1.5.3 1.3.4 1.8.9.6 1.4.9 2.2 1.1.5.1 1 .2 1.5.1.3-.1.7-.3 1-.7 1.5-1.7 1.9-3.2 2.2-4.1 0-.1 0-.2.1-.2 0 .1.1.1.1.2 0 0 .1-.1.1-.2l.1-.1c1.3-1.6 2.9-4.5 2.1-7zM74.3 49.9c-.1-.3-.1-.7-.2-1.1v-.2c-.1-.2-.1-.4-.2-.6 0-.1-.1-.3-.1-.5s-.1-.5-.1-.7v-.1c0-.2-.1-.5-.1-.7-.1-.3-.1-.7-.2-1.1v-.1c0-.2 0-.3-.1-.5v-.9c0-.1 0-.2.1-.3V43h-.3c-1.1.1-3.8.4-6.7.2-1.2-.1-2.4-.3-3.6-.6-1-.3-1.8-.5-2.3-.7-1.2-.4-1.6-.6-1.8-.7 0 .2-.1.4-.1.7 0 .3-.1.5-.1.8-.1.2-.1.4-.2.6l.1.1c.5.5 1.5 1.3 1.5 2.1v.2c-.1.4-.4.5-.8.9-.1.1-.6.7-1.1 1.1l-.6.6c-.1 0-.1.1-.2.1-.1.1-.3.2-.4.3-.2.1-.7.5-.8.6-.1.1-.2.1-.3.1-2.8 8.8-2.2 13.5-1.5 16.1.1.5.3 1 .4 1.3-.4.5-.8 1-1.2 1.4-1.2 1.5-2 2.6-2.6 4.2 0 .1 0 .1-.1.2 0 .1 0 .2-.1.2-.2.5-.3 1-.4 1.5-.6 2.3-.8 4.5-.9 6.6-.1 2.4-.2 4.6-.5 6.9.7.3 3.1.9 4.7.6.2-.1 0-3.9.6-5.7l.6-1.5c.4-.9.9-1.9 1.3-3.1.3-.7.5-1.5.7-2.4.1-.5.2-1 .3-1.6V74v-.1c.1-.6.1-1.3.1-2 0-.2-.7.3-1.1.9.3-1.8 1.3-2.1 2-3.2.3-.5.6-1.1.6-2 2.5-1.7 4-3.7 5-5.7.2-.4.4-.9.6-1.4.3-.8.5-1.6.7-2.4.3-1.4.8-3.2 1.2-4.8v-.1c.4-1.2.8-2.2 1.2-2.6-.2.9-.4 1.7-.6 2.5v.2c-.6 3.5-.7 6.2-2 9.2 1 2.6 1.9 3.9 2 7.6-2 0-3.2 1.6-3.7 3.2 1.2.3 3.9.7 8.3.1h.3c.1-.5.3-1.1.5-1.5.3-.8.5-1.5.6-2.2.2-1.3.1-2.4 0-3.2 3.9-3.7 2.6-11 1.6-16.6zm.3-15.1c.1-.3.2-.6.4-.8.2-.3.3-.7.5-1 .1-.3.3-.6.4-.9.5-1.5.4-2.8.3-3.5-.1 0-.1-.1-.2-.1-.5-.2-.9-.4-1.4-.6-.1 0-.2-.1-.3-.1-3.8-1.2-7.9-.9-11.9.1-1 .2-1.9.5-2.9.1-2.3-.8-3.9-1.9-4.6-2.8l-.2-.2c-.1.2-.2.4-.4.6.2 2.3-.5 3.9-1.4 5.1.9 1.2 2.6 2.8 3.6 3.4 1.1.6 1.7.7 3.4.4-.6.7-1.1 1-1.9 1.4.1.7.2 2 .5 3.4.3.3 1.2.8 2.3 1.3.5.3 1.1.5 1.7.7.8.3 1.7.6 2.4.8.1 0 .2.1.3.1.5.1 1.1.2 1.8.2h.9c2.1 0 4.5-.2 5.4-.3h.1c-.1-2.7.2-4.6.7-6.2.2-.3.4-.7.5-1.1zm-23.2 9.3v.2c-.3 1.7.5 2.4 1.9 3.4.6.5 0 .5.5.8.3.2.7.3 1 .3.3 0 .5 0 .8-.1.2-.1.4-.3.6-.5.1-.1.3-.2.5-.4.3-.2.6-.5.7-.6.1-.1.2-.1.3-.2.2-.2.5-.5.6-.7.2-.2.4-.5.5-.7 0-.1.1-.1.1-.1v-.1c.1-.4-.3-.8-.8-1.3-.2-.2-.4-.3-.5-.5-.3-.3-.6-.5-1-.7-.9-.5-1.9-.7-3-.7l-.3-.3c-2.2-2.5-3.2-4.8-3.9-6.5-.9-2.1-1.9-3.3-3.9-4.9 1 .4 1.8.8 2.3 1.1.5.4 1.3.4 1.9.2.2-.1.5-.2.7-.3.2-.1.4-.2.6-.4 1.6-1.3 2.5-3.8 2.6-5.6v-.1c.2-.3.6-1.1.8-1.4l.1.1c.1.1.3.2.6.5.1 0 .1.1.2.1.1.1.2.1.2.2.8.6 1.9 1.3 2.6 1.7 1.4.7 2.3.7 5.3-.1 2.2-.6 4.8-.8 6.8-.8 1.4 0 2.7.3 4 .7.2.1.4.1.5.2.3.1.6.2.9.4 0 0 .1 0 .1.1.8.4 2.1 1.2 2.5-.3.1-2-.6-3.9-1.6-5.3 0 0-.1 0-.1-.1-.1-.1-.2-.2-.4-.3-.1-.1-.2-.1-.3-.2-.1-.1-.2-.2-.4-.2-.6-.4-1.2-.8-1.6-.9-.1-.1-.3-.1-.4-.2h-.1-.1c-.1 0-.3-.1-.4-.1-.1 0-.1 0-.2-.1h-.1l-.2-.4c-.2-.1-.4-.2-.5-.2h-.6c-.3 0-.5.1-.7.1-.7.1-1.2.3-1.7.4-.2 0-.3.1-.5.1-.5.1-1 .2-1.6.2-.4 0-.9-.1-1.5-.2-.4-.1-.8-.2-1.1-.3-.2-.1-.4-.1-.6-.2-.6-.2-1.1-.3-1.7-.4h-.2-1.8c-.3 0-.6.1-1 .1H57.9c-.8 0-1.5 0-2.3-.1-.2 0-.5-.1-.7-.1-.5-.1-.9-.2-1.3-.4-.2-.1-.3-.1-.4-.2-.1 0-.2 0-.2-.1-.3-.1-.6-.1-.9-.1H51h-.1c-.4 0-.9.1-1.4.2-1.1.2-2.1.6-3 1.3-.3.2-.6.5-.8.8-.1.1-.2.2-.2.3-.4.6-.8 1.2-.9 2 0 .2-.1.4-.1.6 0 .2 1.7.7 2.3 2.8-.8-1.2-2.3-2.5-4.1-1.4-1.5 1-1.1 3.1-2.4 5.4-.3.5-.6.9-1 1.4-.8 1-.7 2.1.2 4.4 1.4 3.4 7.6 5.3 11.5 8.3l.4.4zm8.7-36.3c0 .6.1 1 .2 1.6v.1c0 .3.1.6.1.9.1 1.2.4 2 1 2.9 0 .1.1.1.1.2.3.2.5.3.8.4 1.1.2 3.1.3 4.2 0 .2-.1.5-.3.7-.5.4-.4.7-1.1.9-1.7.1-.7.3-1.3.4-1.8 0-.2.1-.4.1-.5v-.1c0-.2 0-.3.1-.5.2-.7.2-2.4.3-2.8.1-.7 0-1.8-.1-2.5 0-.2-.1-.4-.1-.5v-.1c-.2-.5-1.4-1.4-4.3-1.4-3.1 0-4 1-4.1 1.5v.1c0 .1 0 .3-.1.5-.1.4-.2 1.4-.2 1.9v2.3zm-6 88.6c0-.1-.1-.2-.1-.3-.7-1.5-1.1-3.5-1.3-4.6.4.1.7.6.8.3.2-.5-.4-1.5-.5-2.2v-.1c-.5-.5-4-.5-3.7-.3-.4.8-1 .6-1.3 2.1-.1.7.8.1 1.7.1-1.4.9-3 2.1-3.4 3.2-.1.1-.1.2-.1.3 0 .2-.1.4-.1.5-.1 1.2.5 1.6 2 2.4H48.4c1.4.3 3 .3 4.3.3 1.2-.2 1.6-.7 1.6-1.4-.2-.1-.2-.2-.2-.3z"style=fill:#efefef /><path d="M56.1 36.5c.3 1.4.5 2.4.8 4.2h-.2c-.1.5-.1.9-.1 1.3-1-.4-2.2-.5-2.6-.5-3.7-4.4-2.9-6.1-4.4-8.3.4-.2 1-.4 1.5-.8 1.6 1.9 3.3 3 5 4.1zm-1.7 13.2s-1.4 0-2.3-1c0 0-.1-.5.1-.7 0 0-1.2-1-1.5-1.7-.2-.5-.3-1.1-.2-1.6-4.4-3.7-10.9-4.2-12.9-9.1-.5-1.2-1.3-2.9-.9-3.9-.3.1-.5.2-.8.3-2.9.9-11.7 5.3-17.9 8.8 1.6 1.7 2.6 4.3 3.2 7.2l.3 1.5c.1.5.1 1 .2 1.5.1 1.4.4 2.7.8 3.9.2.8.6 1.5.9 2.2.6 1 1.2 1.9 2.1 2.6.6.5 1.2.9 1.9 1.3 2.1 1.1 5 1.6 8.6 1.5H37.9c.5 0 1 .1 1.5.1h.1c.4.1.9.1 1.3.2h.2c.4.1.9.2 1.3.4h.1c.4.1.8.3 1.1.5h.1c.4.2.7.4 1.1.6h.1c.7.4 1.3.9 1.9 1.5l.1.1c.6.5 1.1 1.1 1.5 1.8 0 .1.1.1.1.2s.1.1.1.2c.4.6 1.2 1.1 1.9 1.3.7-.9 1.5-1.8 2.2-2.8-1.6-6 0-11.7 1.8-16.9zm-26-15.9c5-2.4 9-4.1 9.9-4.5.3-.6.6-1.4.9-2.6.1-.3.2-.5.3-.8 1-2.7 2.7-2.8 3.5-3v-.2c.1-1.1.5-2 1-2.8-8.8 2.5-18 5.5-28 11.7-.1.1-.2.2-.4.2C11.3 34.5 3 40.3 1.3 51c2.4-2.7 6-5.6 10.5-8.5.1-.1.3-.2.5-.3.2-.1.5-.3.7-.4 1.2-.7 2.4-1.4 3.6-2.2 2.2-1.2 4.5-2.4 6.7-3.5 1.8-.8 3.5-1.6 5.1-2.3zm54.9 61.3l-.3-.3c-.8-.6-4.1-1.2-5.5-2.3-.4-.3-1.1-.7-1.7-1.1-1.6-.9-3.5-1.8-3.5-2.1v-.1c-.2-1.7-.2-7 .1-8.8.3-1.8.7-4.4.8-5.1.1-.6.5-1.2.1-1.2h-.4c-.2 0-.4.1-.8.1-1.5.3-4.3.6-6.6.4-.9-.1-1.6-.2-2-.3-.5-.1-.7-.2-.9-.3H62.3c-.4.5 0 2.7.6 4.8.3 1.1.8 2 1.2 3 .3.8.6 1.8.8 3.1 0 .2.1.4.1.7.2 2.8.3 3.6-.2 4.9-.1.3-.3.6-.4 1-.4.9-.7 1.7-.6 2.3 0 .2.1.4.1.5.2.4.6.7 1.2.8.2 0 .3.1.5.1.3 0 .6.1.9.1 3.4 0 5.2 0 8.6.4 2.5.4 3.9.6 5.1.5.4 0 .9-.1 1.4-.1 1.2-.2 1.8-.5 1.9-.9-.1.2-.1.1-.2-.1zM60.2 16.4zm-.5 1.7zm3.8.5c.1 0 .3.1.5.1.4.1.7.2 1.2.3.3.1.6.1.9.1h1.3c.3-.1.7-.1 1-.2.7-.2 1.5-.4 2.7-.6h.3c.3 0 .6.1.9.3.1.1.2.1.4.2.3.2.8.2 1.2.4h.1c.1 0 .1.1.2.1.6.3 1.3.7 1.9 1.1l.3.3c.9-.1 1.6-.2 2.1-.2h.1c-.2-.4-.3-1.3-1.8-.6-.6-.7-.8-1.3-2.1-.9-.1-.2-.2-.3-.3-.4l-.1-.1c-.1-.1-.2-.3-.3-.4 0-.1-.1-.1-.1-.2-.2-.3-.5-.5-.9-.7-.7-.4-1.5-.6-2.3-.5-.2 0-.4.1-.6.2-.1 0-.2.1-.2.1-.1 0-.2.1-.3.2-.5.3-1.3.8-2.1 1-.1 0-.1 0-.2.1-.2 0-.4.1-.5.1H66.5h-.1c-.4-.1-1.1-.2-2-.5-.1 0-.2-.1-.3-.1-.9-.2-1.8-.5-2.7-.8-.3-.1-.7-.2-1-.3-.1 0-.1 0-.2-.1h-.1s-.1 0-.1-.1c-.3-.3-.7-.6-1.3-.8-.5-.2-1.2-.4-2.1-.5-.2 0-.5 0-.7.1-.4.2-.8.6-1.2.9.1.1.3.3.4.5.1.2.2.4.3.7l-.6-.6c-.5-.4-1.1-.8-1.7-.9-.8-.2-1.4.4-2.3.9 1 0 1.8.1 2.5.4.1 0 .1 0 .2.1h.1c.1 0 .2.1.3.1.9.4 1.8.6 2.7.6h1.3c.5 0 .8-.1 1.1-.1.1 0 .4 0 .7-.1h2.2c.4.4.9.6 1.6.8z"style=fill:#88ce02 /><path d="M100 51.8c0-19.5-12.5-36.1-30-42.1.1-1.2.2-2.4.3-3.1.1-1.5.2-3.9-.5-4.9-1.6-2.3-9.1-2.1-10.5-.1-.4.6-.7 3.6-.6 5.9-1.1-.1-2.2-.1-3.3-.1-16.5 0-30.9 9-38.6 22.3-2.4 1.4-4.7 2.8-6.1 4C5.4 38 2.2 43.2 1 47c-1.6 4.7-1.1 7.6.4 5.8 1.2-1.5 6.6-5.9 10.1-8.2-.4 2.3-.6 4.8-.6 7.2 0 21 14.5 38.5 34 43.3-.1 1.1.1 2 .7 2.6.9.8 3.2 2 6.4 1.6 2.9-.3 3.5-.5 3.2-2.9h.2c2.7 0 5.3-.2 7.8-.7.1.1.2.2.4.3 1.5 1 7.1.8 9.6.7s6.2.9 8.6.5c2.9-.5 3.4-2.3 1.6-3.2-1.5-.8-3.8-1.3-6.7-3.1C90.6 83.4 100 68.7 100 51.8zM60.1 5.5c0-.5.1-1.5.2-2.1 0-.2 0-.4.1-.5v-.1c.1-.5 1-1.5 4.1-1.5 2.9 0 4.2.9 4.3 1.4v.1c0 .1 0 .3.1.5.1.8.2 1.9.1 2.7 0 .5-.1 2.1-.2 2.9 0 .1 0 .3-.1.5v.1c0 .2-.1.3-.1.5-.1.5-.2 1.1-.4 1.8-.1.6-.5 1.2-.9 1.7-.2.3-.5.5-.7.5-1.1.3-3.1.3-4.2 0-.3-.1-.5-.2-.8-.4 0-.1-.1-.1-.1-.2-.6-.9-.9-1.7-1-2.9 0-.4-.1-.6-.1-.9v-.1c-.1-.6-.2-1-.2-1.6v-.3c-.1-1.3-.1-2.1-.1-2.1zm-.4 7.5v-.4c.6.6 1.3 1.3 1.8 1.7.2.2.5.3.8.3.2 0 .3 0 .5.1h1.6c.8 0 1.6.1 2 0 .1 0 .2 0 .3-.1.6-.3 1.4-1 2.1-1.6 0 .6.1 1.2.1 1.7v1.5c0 .3 0 .5.1.7-.1.1-.2.1-.4.2-.7.4-1.7 1-2.3.9-.5-.1-1.5-.3-2.6-.7-1.2-.3-2.4-.8-3.2-1.2 0 0-.1 0-.1-.1-.2-.3-.4-.5-.6-.7-.3-.4-.5-.6-.5-.7.3-.4.4-.9.4-1.6zm.5 3.4zm-7.3-.3c.6.1 1.2.5 1.7.9.2.2.5.4.6.6-.1-.2-.2-.5-.3-.7-.1-.2-.3-.4-.4-.5.4-.3.8-.7 1.2-.9.2-.1.4-.1.7-.1.9.1 1.6.2 2.1.5.6.2 1 .5 1.3.8 0 0 .1 0 .1.1h.1c.1 0 .1 0 .2.1.3.1.6.2 1 .3.9.3 1.9.6 2.7.8.1 0 .2.1.3.1.9.2 1.6.4 2 .5h.4c.2 0 .4 0 .5-.1.1 0 .1 0 .2-.1.7-.2 1.5-.7 2.1-1 .1-.1.2-.1.3-.2.1 0 .2-.1.2-.1.2-.1.4-.2.6-.2.8-.2 1.7.1 2.3.5.3.2.6.4.9.7 0 .1.1.1.1.2.1.2.2.3.3.4l.1.1c.1.1.2.2.3.4 1.3-.4 1.5.2 2.1.9 1.6-.7 1.7.2 1.8.6h-.1c-.5 0-1.2 0-2.1.2l-.3-.3c-.5-.4-1.2-.8-1.9-1.1-.1 0-.1-.1-.2-.1h-.1c-.4-.2-.8-.2-1.2-.4-.1-.1-.2-.1-.4-.2-.3-.1-.6-.3-.9-.3h-.3c-1.2.1-2 .4-2.7.6-.3.1-.7.2-1 .2-.4.1-.8.1-1.3 0-.3 0-.6-.1-.9-.1-.5-.1-.8-.2-1.2-.3-.2 0-.3-.1-.5-.1h-.1c-.6-.2-1.2-.3-1.8-.4h-.1-2.1c-.4.1-.6.1-.7.1-.3 0-.7.1-1.1.1h-1.3c-.9 0-1.9-.2-2.7-.6-.1 0-.2-.1-.3-.1H53c-.1 0-.1 0-.2-.1-.7-.3-1.6-.4-2.5-.4 1.2-.8 1.8-1.4 2.6-1.3zm6.8 2zm-15.2 4.1c.1-.7.4-1.4.9-2 .1-.1.2-.2.2-.3l.8-.8c.9-.6 1.9-1.1 3-1.3.5-.1 1-.2 1.4-.2H52c.3 0 .6.1.9.1.1 0 .2 0 .2.1.1.1.2.1.4.2.4.2.8.3 1.3.4.2 0 .5.1.7.1.7.1 1.5.1 2.3.1H58.7c.4 0 .7-.1 1-.1H61.7c.6.1 1.1.2 1.7.4.2 0 .4.1.6.2.3.1.7.2 1.1.3.6.1 1.1.2 1.5.2.6 0 1.1-.1 1.6-.2.2 0 .3-.1.5-.1.5-.1 1-.3 1.7-.4.2 0 .5-.1.7-.1h.6c.2 0 .4.1.5.2l.1.1h.1c.1 0 .1 0 .2.1.2.1.3.1.4.1h.2c.1.1.3.1.4.2.4.2 1 .6 1.6.9.1.1.2.2.4.2.1.1.2.1.3.2.2.1.3.3.4.3l.1.1c1.1 1.4 1.8 3.3 1.6 5.3-.3 1.5-1.6.7-2.5.3 0 0-.1 0-.1-.1-.3-.1-.6-.2-.9-.4-.2-.1-.4-.1-.5-.2-1.2-.4-2.5-.7-4-.7-2 0-4.6.1-6.8.8-3 .8-4 .8-5.3.1-.8-.4-1.8-1.1-2.6-1.7-.1-.1-.2-.1-.2-.2-.1-.1-.1-.1-.2-.1-.3-.2-.6-.4-.6-.5l-.1-.1c-.2.3-.6 1-.8 1.4v.1c-.1 1.7-1 4.2-2.6 5.6-.2.1-.4.3-.6.4-.2.1-.5.2-.7.3-.7.2-1.4.2-1.9-.2-.5-.3-1.3-.7-2.3-1.1 2 1.6 3 2.8 3.9 4.9.7 1.7 1.7 4 3.9 6.5l.3.3c1.1 0 2.1.2 3 .7.4.2.7.4 1 .7.2.2.4.3.5.5.5.4.9.8.8 1.3v.1s0 .1-.1.1c-.1.2-.3.5-.5.7-.1.1-.4.4-.6.7-.1.1-.2.2-.3.2-.1.1-.4.3-.7.6-.2.2-.4.3-.5.4-.2.1-.4.4-.6.5-.3.1-.5.2-.8.1-.3 0-.7-.2-1-.3-.5-.3.1-.3-.5-.8-1.4-1-2.2-1.7-1.9-3.4v-.2c-.2-.1-.3-.3-.5-.4-3.9-3-10.1-4.9-11.5-8.3-.9-2.3-1-3.4-.2-4.4.4-.5.8-1 1-1.4 1.3-2.3.9-4.4 2.4-5.4 1.8-1.2 3.3.2 4.1 1.4-.5-2.1-2.3-2.6-2.3-2.8.3.1.3-.1.3-.3zm29 20s-.1 0 0 0c-.1 0-.1 0 0 0-.9.1-3.3.3-5.4.3h-.9c-.7 0-1.3-.1-1.8-.2-.1 0-.2 0-.3-.1-.7-.2-1.6-.5-2.4-.8-.6-.2-1.2-.5-1.7-.7-1.1-.5-2.1-1.1-2.3-1.3-.5-1.4-.7-2.7-.7-3.4.8-.4 1.3-.7 1.9-1.4-1.7.3-2.4.2-3.4-.4-1-.5-2.6-2.2-3.6-3.4 1-1.2 1.7-2.9 1.4-5.1.1-.2.3-.4.4-.6 0 .1.1.1.2.2.7.9 2.4 2 4.6 2.8 1.1.4 2 .1 2.9-.1 4-1 8.1-1.3 11.9-.1.1 0 .2.1.3.1.5.2.9.4 1.4.6.1 0 .1.1.2.1.1.7.2 2-.3 3.5-.1.3-.2.6-.4.9-.2.3-.3.6-.5 1-.1.3-.2.5-.4.8-.2.4-.3.8-.5 1.3-.4 1.4-.7 3.4-.6 6zm-23.9-9c.4-.2 1-.4 1.5-.8 1.6 1.8 3.3 3 5 4.1.3 1.4.5 2.4.8 4.2h-.2c-.1.5-.1.9-.1 1.3-1-.4-2.2-.5-2.6-.5-3.7-4.3-3-6-4.4-8.3zm-32.9 6.5c-1.3.7-2.5 1.4-3.6 2.2-.2.1-.5.3-.7.4-.1.1-.3.2-.5.3-4.5 2.9-8.1 5.8-10.5 8.5 1.7-10.8 10-16.5 14.3-19.2.1-.1.2-.2.4-.2 10-6.2 19.2-9.2 28-11.7-.5.8-.9 1.7-1 2.8v.2c-.8.1-2.5.2-3.5 3-.1.2-.2.5-.3.8-.3 1.2-.6 2-.9 2.6-.9.4-5 2.2-9.9 4.5-1.6.8-3.3 1.6-5 2.4-2.3 1-4.6 2.2-6.8 3.4zm28 24.8s0-.1 0 0c-.4-.3-.8-.5-1.2-.7h-.1c-.4-.2-.7-.3-1.1-.5h-.1c-.4-.1-.8-.3-1.3-.4h-.2c-.4-.1-.8-.2-1.3-.2h-.1c-.5-.1-1-.1-1.5-.1H35.9c-3.7.1-6.5-.4-8.6-1.5-.7-.4-1.4-.8-1.9-1.3-.9-.7-1.5-1.6-2.1-2.6-.4-.7-.7-1.4-.9-2.2-.4-1.2-.6-2.5-.8-3.9 0-.5-.1-1-.2-1.5l-.3-1.5c-.6-2.9-1.6-5.5-3.2-7.2 6.3-3.5 15-7.9 17.8-8.8.3-.1.6-.2.8-.3-.3 1.1.4 2.7.9 3.9 2.1 4.9 8.6 5.4 12.9 9.1 0 .5 0 1.1.2 1.6.5.6 1.7 1.6 1.7 1.6-.2.2-.1.7-.1.7.9 1 2.3 1 2.3 1-1.8 5.2-3.4 10.9-1.9 16.9-.7 1-1.5 1.8-2.2 2.8-.7-.2-1.4-.6-1.9-1.3 0-.1-.1-.1-.1-.2s-.1-.1-.1-.2l-1.5-1.8-.1-.1c-.5-.4-1.2-.9-1.9-1.3zm7.9 33.6c-1.3.1-2.9 0-4.3-.3h-.2-.1c-1.5-.8-2.1-1.2-2-2.4 0-.2 0-.3.1-.5 0-.1.1-.2.1-.3.5-1.1 2.1-2.2 3.4-3.2-.8 0-1.8.7-1.7-.1.2-1.5.9-1.3 1.3-2.1-.2-.3 3.3-.2 3.8.3v.1c0 .7.7 1.7.5 2.2-.1.3-.4-.2-.8-.3.2 1.1.6 3.1 1.3 4.6.1.1.1.2.1.3 0 .1.1.2.1.3 0 .7-.4 1.2-1.6 1.4zM59 67.7c0 .9-.3 1.6-.6 2-.7 1.1-1.7 1.4-2 3.2.4-.6 1.1-1.1 1.1-.9 0 .8-.1 1.4-.1 2v.2c-.1.6-.2 1.1-.3 1.6-.2.9-.5 1.7-.7 2.4-.4 1.2-.9 2.1-1.3 3.1l-.6 1.5c-.6 1.7-.4 5.6-.6 5.7-1.6.3-4.1-.3-4.7-.6.3-2.2.4-4.5.5-6.9.1-2.1.3-4.3.9-6.6.1-.5.3-1 .4-1.5 0-.1 0-.2.1-.2 0-.1 0-.1.1-.2.5-1.6 1.4-2.7 2.6-4.2.4-.4.7-.9 1.2-1.4-.1-.4-.2-.8-.4-1.3-.7-2.6-1.3-7.3 1.5-16.1.1 0 .2-.1.3-.1.2-.1.7-.5.8-.6.1-.1.3-.2.4-.3.1 0 .1-.1.2-.1l.6-.6 1.1-1.1c.4-.4.7-.5.8-.9v-.2c0-.8-1.1-1.5-1.5-2.1l-.1-.1c.1-.2.1-.4.2-.6 0-.2.1-.5.1-.8 0-.2.1-.5.1-.7.1.1.6.4 1.8.7.6.2 1.3.4 2.3.7 1.1.3 2.4.5 3.6.6 2.9.2 5.6 0 6.7-.2h.3v.1c0 .1 0 .2-.1.3v.9c0 .2 0 .3.1.5v.1c0 .4.1.7.2 1.1 0 .3.1.5.1.7v.1c0 .3.1.5.1.7 0 .2.1.3.1.5.1.2.1.4.2.6v.2c.1.4.2.8.2 1.1 1 5.7 2.3 12.9-1.1 16.7.2.8.3 1.9 0 3.2-.1.7-.3 1.4-.6 2.2-.2.5-.3 1-.5 1.5h-.3c-4.5.6-7.1.2-8.3-.1.5-1.6 1.7-3.3 3.7-3.2-.1-3.7-1.1-5-2-7.6 1.3-3 1.3-5.7 2-9.2v-.2c.2-.8.3-1.6.6-2.5-.4.5-.8 1.5-1.2 2.6v.1c-.5 1.5-.9 3.4-1.2 4.8-.2.8-.4 1.6-.7 2.4-.2.5-.4.9-.6 1.4-1.5 1.9-3 3.9-5.5 5.6zm18.5 24.9c1.5 1.1 4.7 1.8 5.5 2.3l.3.3c.1.1.1.2.1.3-.1.4-.7.7-1.9.9-.5.1-.9.1-1.4.1-1.3 0-2.6-.2-5.1-.5-3.4-.5-5.2-.4-8.6-.4-.3 0-.6 0-.9-.1-.2 0-.4-.1-.5-.1-.6-.2-1-.5-1.2-.8-.1-.2-.1-.3-.1-.5-.1-.7.2-1.5.6-2.3.2-.4.3-.7.4-1 .5-1.3.4-2.1.2-4.9 0-.2-.1-.4-.1-.7-.2-1.3-.5-2.3-.8-3.1-.4-1.1-.9-1.9-1.2-3-.6-2.1-1-4.3-.6-4.8H62.5c.2.1.5.2.9.3.5.1 1.1.2 2 .3 2.2.2 5.1-.2 6.6-.4.3-.1.6-.1.8-.1h.4c.4 0 .1.6-.1 1.2-.1.7-.5 3.3-.8 5.1-.3 1.8-.2 7.1-.1 8.8v.1c0 .3 1.9 1.2 3.5 2.1.7.2 1.4.5 1.8.9zm4.8-48.2c0 .1 0 .1 0 0-.1.1-.2.2-.2.3 0-.1-.1-.1-.1-.2 0 .1 0 .2-.1.2-.2.9-.6 2.4-2.2 4.1-.4.4-.7.6-1 .7-.5.1-.9 0-1.5-.1-.9-.2-1.3-.6-2.2-1.1-.1-.6-.3-1.3-.4-1.8 0-.3-.1-.5-.1-.6v-1l.4-.4s.7-1 1.8-1 2.2-.2 2.5-.5v-.1-.3c0-.1 0-.2-.1-.3-.4-1.4-2.1-1.8-1.4-4.8 0-.2.3-.5 1.2-.5-1.4-.3-2-.4-3-1.3.5-1.1 1-1.9 1.3-2.6.8-1.5.3-3.5.3-3.5.8-.3 1.6-.7 1.7-1 .9-2.8-.7-5.5-2.5-7.2 1.2-.1 2.6.1 3.6 1.1 2.4 2.4 1.8 5 1 6.8.6.7 2.1 2.9 1.2 5.3-.2.6-1.4.6-2.3 2.1 2.3-1.3 3.7-1 4.2.7 1 2.4-.6 5.3-2.1 7z"/><path d="M22 53.4v-.2c0-.2-.1-.5-.2-.9s-.1-.8-.2-1.3c-.5-4.7-1.9-9.4-4.9-11.3 3.7-2 16.8-8.5 21.9-10.5 2.9-1.2.8-.4-.2 1.4-.8 1.4-.3 2.9-.5 3.2-.6.8-12.6 10.5-15.9 19.6zm32.2-2.3c-3.4 3.8-12 11-18.2 11.4 8.7-.2 12.2 4.1 14.7 9.7 2.6-5.2 2.7-10.3 2.6-16.1 0-2.6 1.8-6 .9-5zm5.3-23L54.3 24s-1.1 3.1-1 4.6c.1 1.6-1.8 2.7-.9 3.6.9.9 3.2 2.5 4 3.4.7.9 1.1 7.1 1.1 7.1l2.2 2.7s1-1.8 1.1-6.3c.2-5.4-2.9-7.1-3.3-8.6-.4-1.4.6-2.9 2-2.4zm3.1 45.6l3.9.3s1.2-2.2 2.1-3.5c.9-1.4.4-1.6 0-4.6-.4-3-1.4-9.3-1.2-13.6l-3.1 10.2s1.8 5.6 1.6 6.4c-.1.8-3.3 4.8-3.3 4.8zm5 18.8c-1.1 0-2.5-.4-3.5-.8l-1 .3.2 4s5.2.7 4.6-.4c-.6-1.2-.3-3.1-.3-3.1zm12 .6c-1 0-.3.2.4 1.2.8 1 .1 2-.8 2.3l3.2.5 1.9-1.7c.1 0-3.7-2.3-4.7-2.3zM73 76c-1.6.5-4.2.8-5.9.8-1.7.1-3.7-.1-5-.5v1.4s1.2.5 5.4.5c3.5.1 5.7-.8 5.7-.8l.9-.8c-.1.1.5-1.1-1.1-.6zm-.2 3.1c-1.6.6-3.9.6-5.6.7-1.7.1-3.7-.1-5-.5l.1 1.4s.7.3 4.9.4c3.5.1 5.7-.7 5.7-.7l.3-.5c-.1-.1.3-1-.4-.8zm5.9-42.7c-.9-.8-1.4-2.4-1.5-3.3l-1.9 2.5.7 1.2s2.5.1 2.8.1c.4 0 .3-.1-.1-.5zM69 14.7c.6-.7.2-2.7.2-2.7L66 14.6l-4.4-.8-.5-1.3-1.3-.1c.8 1.8 1.8 2.5 3.3 3.1.9.4 4.5.9 5.9-.8z"style=opacity:.4;fill-rule:evenodd;clip-rule:evenodd /></svg></a></div></div>';

  if (element) {
    root.style.position = "absolute";
    root.style.top = minimal ? "calc(100% - 42px)" : "calc(100% - 51px)";
  }

  if (css) {
    if (_isString(css)) {
      root.style.cssText = css;
    } else if (_isObject(css)) {
      css.data = "root";
      gsap.set(root, css).kill();
    }

    if (root.style.top) {
      root.style.bottom = "auto";
    }

    if (root.style.width) {
      gsap.set(root, {
        xPercent: -50,
        left: "50%",
        right: "auto",
        data: "root"
      }).kill();
    }
  }

  if (!minimal && root.offsetWidth < 600) {
    root.setAttribute("class", "gs-dev-tools minimal");

    if (element) {
      root.style.top = "calc(100% - 42px)";
    }
  }

  return root;
},
    _clickedOnce = true,
    //perhaps we shouldn't preventDefault() on the first mousedown/touchstart/pointerdown so that iframes get focus properly. Did that previously, but now it seems to prevent interaction on the first click (annoying).
_addListener = function _addListener(e, type, callback, capture) {
  var handler, altType;

  if (type === "mousedown" || type === "mouseup") {
    e.style.cursor = "pointer";
  }

  if (type === "mousedown") {
    //some browsers call BOTH mousedown AND touchstart, for example, on a single interaction so we need to skip one of them if both are called within 100ms.
    altType = !_isUndefined(e.onpointerdown) ? "pointerdown" : !_isUndefined(e.ontouchstart) ? "touchstart" : null;

    if (altType) {
      handler = function handler(event) {
        if (event.target.nodeName.toLowerCase() !== "select" && event.type === altType) {
          //don't preventDefault() on a <select> or else it won't open!
          event.stopPropagation();

          if (_clickedOnce) {
            //otherwise, both touchstart and mousedown will get called.
            event.preventDefault();
            callback.call(e, event);
          }
        } else if (event.type !== altType) {
          callback.call(e, event);
        }

        _clickedOnce = true;
      };

      e.addEventListener(altType, handler, capture);

      if (altType !== "pointerdown") {
        e.addEventListener(type, handler, capture);
      }

      return;
    }
  }

  e.addEventListener(type, callback, capture);
},
    _removeListener = function _removeListener(e, type, callback) {
  e.removeEventListener(type, callback);
  type = type !== "mousedown" ? null : !_isUndefined(e.onpointerdown) ? "pointerdown" : !_isUndefined(e.ontouchstart) ? "touchstart" : null;

  if (type) {
    e.removeEventListener(type, callback);
  }
},
    _selectValue = function _selectValue(element, value, label, insertIfAbsent) {
  var options = element.options,
      i = options.length,
      option;
  value += "";

  while (--i > -1) {
    if (options[i].innerHTML === value || options[i].value === value) {
      element.selectedIndex = i;
      label.innerHTML = options[i].innerHTML;
      return options[i];
    }
  }

  if (insertIfAbsent) {
    option = _createElement("option", element);
    option.setAttribute("value", value);
    option.innerHTML = label.innerHTML = _isString(insertIfAbsent) ? insertIfAbsent : value;
    element.selectedIndex = options.length - 1;
  }
},
    //increments the selected value of a <select> up or down by a certain amount.
_shiftSelectedValue = function _shiftSelectedValue(element, amount, label) {
  var options = element.options,
      i = Math.min(options.length - 1, Math.max(0, element.selectedIndex + amount));
  element.selectedIndex = i;

  if (label) {
    label.innerHTML = options[i].innerHTML;
  }

  return options[i].value;
},
    //moves everything from _globalTimeline into _recordedRoot and updates the _rootTween if it is currently controlling the Global timeline (_recordedRoot). _recordedTemp is just a temporary recording area for anything that happens while _recordedRoot is paused. Returns true if the _recordedRoot's duration changed due to the merge.
_merge = function _merge() {
  var t = _globalTimeline._first,
      duration,
      next,
      target;

  if (_rootInstance) {
    duration = _recordedRoot._dur;

    while (t) {
      next = t._next;
      target = t._targets && t._targets[0];

      if (!(_isFunction(target) && target === t.vars.onComplete && !t._dur) && !(target && target._gsIgnore)) {
        //typically, delayedCalls aren't included in the _recordedTemp, but since the hijacked add() below fires BEFORE TweenLite's constructor sets the target, we couldn't check that target === vars.onComplete there. And Draggable creates a tween with just an onComplete (no onReverseComplete), thus it fails that test. Therefore, we test again here to avoid merging that in.
        _recordedRoot.add(t, t._start - t._delay);
      }

      t = next;
    }

    return duration !== _recordedRoot.duration();
  }
},
    _updateRootDuration = function _updateRootDuration() {
  if (_rootInstance) {
    _rootInstance.update();

    _rootIsDirty = false;
  }

  gsap.ticker.remove(_updateRootDuration);
},
    _buildPlayPauseMorph = function _buildPlayPauseMorph(svg) {
  var tl = gsap.timeline({
    data: "root",
    parent: _independentRoot,
    onComplete: function onComplete() {
      return tl.kill();
    }
  });
  tl.to(svg.querySelector(".play-1"), {
    duration: 0.4,
    attr: {
      d: "M5.75,3.13 C5.75,9.79 5.75,16.46 5.75,23.13 4.08,23.13 2.41,23.13 0.75,23.13 0.75,16.46 0.75,9.79 0.75,3.12 2.41,3.12 4.08,3.12 5.75,3.12"
    },
    ease: "power2.inOut",
    rotation: 360,
    transformOrigin: "50% 50%"
  }).to(svg.querySelector(".play-2"), {
    duration: 0.4,
    attr: {
      d: "M16.38,3.13 C16.38,9.79 16.38,16.46 16.38,23.13 14.71,23.13 13.04,23.13 11.38,23.13 11.38,16.46 11.38,9.79 11.38,3.12 13.04,3.12 14.71,3.12 16.38,3.12"
    },
    ease: "power2.inOut",
    rotation: 360,
    transformOrigin: "50% 50%"
  }, 0.05);
  return tl;
},
    _buildLoopAnimation = function _buildLoopAnimation(svg) {
  var tl = gsap.timeline({
    data: "root",
    id: "loop",
    parent: _independentRoot,
    paused: true,
    onComplete: function onComplete() {
      return tl.kill();
    }
  });
  tl.to(svg, {
    duration: 0.5,
    rotation: 360,
    ease: "power3.inOut",
    transformOrigin: "50% 50%"
  }).to(svg.querySelectorAll(".loop-path"), {
    duration: 0.5,
    fill: "#91e600",
    ease: "none"
  }, 0);
  return tl;
},
    _getAnimationById = function _getAnimationById(id) {
  return gsap.getById(id) || _independentRoot.getById(id) || id === _recordedRoot.vars.id && _recordedRoot;
},
    _initCore = function _initCore(core) {
  gsap = core || _getGSAP();

  if (gsap && _windowExists()) {
    _doc = document;
    _docEl = _doc.documentElement;
    _win = window;
    gsap.registerPlugin(_Draggable_js__WEBPACK_IMPORTED_MODULE_0__["Draggable"]);
    _globalTimeline = gsap.globalTimeline;
    _globalTimeline._sort = true;
    _globalTimeline.autoRemoveChildren = false;
    Animation = gsap.core.Animation;
    _independentRoot = gsap.timeline({
      data: "indy",
      autoRemoveChildren: true,
      smoothChildTiming: true
    });

    _independentRoot.kill();

    _independentRoot._dp = 0; //don't let it revert to the global timeline as its parent.

    _independentRoot.to({}, {
      duration: 1e12
    });

    _recordedRoot = gsap.timeline({
      data: "root",
      id: "Global Timeline",
      autoRemoveChildren: false,
      smoothChildTiming: true,
      parent: _independentRoot
    });
    _rootTween = gsap.to(_recordedRoot, {
      duration: 1,
      time: 1,
      ease: "none",
      data: "root",
      id: "_rootTween",
      paused: true,
      immediateRender: false,
      parent: _independentRoot
    });
    _independentRoot._start = gsap.ticker.time;
    gsap.ticker.add(function (time) {
      return _independentRoot.render(time - _independentRoot._start);
    }); //align the all of the playheads so they're starting at 0 now.

    _globalTimeline._start += _globalTimeline._time;
    _recordedRoot._start = _globalTimeline._time = _globalTimeline._tTime = 0;

    _delayedCall = function _delayedCall(delay, callback, params, scope) {
      return gsap.to(callback, {
        delay: delay,
        duration: 0,
        onComplete: callback,
        onReverseComplete: callback,
        onCompleteParams: params,
        onReverseCompleteParams: params,
        callbackScope: scope,
        parent: _independentRoot
      });
    }; //in case GSDevTools.create() is called before anything is actually on the global timeline, we've gotta update it or else the duration will be 0 and it'll be stuck.


    _delayedCall(0.01, function () {
      if (_rootInstance) {
        _rootInstance.update();
      } else {
        _merge();
      }
    }); //initially we record everything into the _recordedRoot Timeline because developers might call GSDevTools.create() AFTER some of their code executes, but after 2 seconds if there aren't any GSDevTool instances that have globalSync enabled, we should dump all the stuff from _recordedRoot into the global timeline to improve performance and avoid issues where _recordedRoot is paused and reaches its end and wants to stop the playhead.


    _delayedCall(2, function () {
      var t, next, offset;

      if (!_rootInstance) {
        _merge();

        t = _recordedRoot._first;
        offset = _recordedRoot._start;

        while (t) {
          next = t._next; //any animations that aren't finished should be dumped into the root timeline. If they're done, just kill them.

          if (t._tDur !== t._tTime || !t._dur && t.progress() !== 1) {
            _globalTimeline.add(t, t._start - t._delay + offset);
          } else {
            t.kill();
          }

          t = next;
        }
      }

      if (GSDevTools.globalRecordingTime > 2) {
        _delayedCall(GSDevTools.globalRecordingTime - 2, function () {
          if (_rootInstance) {
            _rootInstance.update();
          }

          _recording = false;
          _globalTimeline.autoRemoveChildren = true;
        });
      } else {
        _recording = false;
        _globalTimeline.autoRemoveChildren = true;
      }

      _startupPhase = false;
    });

    _coreInitted = 1;
  }
},
    _checkIndependence = function _checkIndependence(animation, vars) {
  if (!vars.globalSync && animation.parent !== _globalTimeline) {
    //in case it's nested in a timeline (playing it won't help if the parent timeline isn't playing).
    _globalTimeline.add(animation, _globalTimeline.time());
  }
},
    GSDevTools = function GSDevTools(vars) {
  if (!_coreInitted) {
    _initCore();

    if (!gsap) {
      console.warn("Please gsap.registerPlugin(GSDevTools)");
    }
  }

  this.vars = vars = vars || {};

  if (vars.animation) {
    (GSDevTools.getByAnimation(vars.animation) || {
      kill: function kill() {
        return 0;
      }
    }).kill();
  }

  vars.id = vars.id || (_isString(vars.animation) ? vars.animation : _idSeed++); //try to find a unique ID so that sessionStorage can be mapped to it (otherwise, for example, all the embedded codepens on a page would share the same settings). So if no id is defined, see if there's a string-based "animation" defined. Last of all, we default to a numeric counter that we increment.

  _lookup[vars.id + ""] = this;

  if (!("globalSync" in vars)) {
    //if the user calls create() and passes in an animation AFTER the initial recording time has elapsed, there's a good chance the animation won't be in the recordedRoot, so we change the default globalSync to false because that's the most intuitive behavior.
    vars.globalSync = !vars.animation;
  } //GENERAL/UTILITY


  var _self = this,
      root = _createRootElement(vars.container, vars.minimal, vars.css),
      find = function find(s) {
    return root.querySelector(s);
  },
      record = function record(key, value) {
    if (vars.persist !== false && _supportsStorage) {
      sessionStorage.setItem("gs-dev-" + key + vars.id, value);
    }

    return value;
  },
      recall = function recall(key) {
    var value;

    if (vars.persist !== false && _supportsStorage) {
      value = sessionStorage.getItem("gs-dev-" + key + vars.id);
      return key === "animation" ? value : key === "loop" ? value === "true" : parseFloat(value); // handle data typing too.
    }
  },
      //SCRUBBER/PROGRESS
  playhead = find(".playhead"),
      timelineTrack = find(".timeline-track"),
      progressBar = find(".progress-bar"),
      timeLabel = find(".time"),
      durationLabel = find(".duration"),
      pixelToTimeRatio,
      timeAtDragStart,
      dragged,
      skipDragUpdates,
      progress = 0,
      inPoint = find(".in-point"),
      outPoint = find(".out-point"),
      inProgress = 0,
      outProgress = 100,
      pausedWhenDragStarted,
      list = find(".animation-list"),
      animationLabel = find(".animation-label"),
      selectedAnimation,
      //the currently selected animation
  linkedAnimation,
      //the animation that's linked to all the controls and scrubber. This is always _rootTween if globalSync is true, so it can be different than the selectedAnimation!
  declaredAnimation,
      //whatever the user defines in the config object initially (often this will be null). If the user defines a string, it'll be resolved to a real Animation instance for this variable.
  startTime,
      endTime,
      _fullyInitialized,
      //we call initialize() initially, and then again on the very next tick just in case someone called GSDevTools.create() BEFORE they create their animations. This variable tracks that state. Note: we don't record sessionStorage.setItem() until we're fully initialized, otherwise we may inadvertently set in/out points to the defaults just because the animation couldn't be found (yet).
  keyboardHandler,
      playPauseButton = find(".play-pause"),
      playPauseMorph = _buildPlayPauseMorph(playPauseButton),
      paused = false,
      loopButton = find(".loop"),
      loopAnimation = _buildLoopAnimation(loopButton),
      loopEnabled,
      timeScale = find(".time-scale select"),
      timeScaleLabel = find(".time-scale-label"),
      //spits back a common onPress function for anything that's dragged along the timeline (playhead, inPoint, outPoint). The originRatio is a value from 0-1 indicating how far along the x-axis the origin is located (0.5 is in the center, 0 is left, 1 is on right side). limitElement is optional, and sets the bounds such that the element can't be dragged past the limitElement.
  onPressTimeline = function onPressTimeline(element, originRatio, limitToInOut) {
    return function (e) {
      var trackBounds = timelineTrack.getBoundingClientRect(),
          elementBounds = element.getBoundingClientRect(),
          left = elementBounds.width * originRatio,
          x = gsap.getProperty(element, "x"),
          minX = trackBounds.left - elementBounds.left - left + x,
          maxX = trackBounds.right - elementBounds.right + (elementBounds.width - left) + x,
          unlimitedMinX = minX,
          limitBounds;

      if (limitToInOut) {
        if (element !== inPoint) {
          limitBounds = inPoint.getBoundingClientRect();

          if (limitBounds.left) {
            //if inPoint is hidden (like display:none), ignore.
            minX += limitBounds.left + limitBounds.width - trackBounds.left;
          }
        }

        if (element !== outPoint) {
          limitBounds = outPoint.getBoundingClientRect();

          if (limitBounds.left) {
            //if outPoint is hidden (like display:none), ignore.
            maxX -= trackBounds.left + trackBounds.width - limitBounds.left;
          }
        }
      }

      pausedWhenDragStarted = paused;
      this.applyBounds({
        minX: minX,
        maxX: maxX
      });
      pixelToTimeRatio = linkedAnimation.duration() / trackBounds.width;
      timeAtDragStart = -unlimitedMinX * pixelToTimeRatio;

      if (!skipDragUpdates) {
        linkedAnimation.pause(timeAtDragStart + pixelToTimeRatio * this.x);
      } else {
        linkedAnimation.pause();
      }

      if (this.target === playhead) {
        if (this.activated) {
          this.allowEventDefault = false;
        }

        this.activated = true;
      }

      dragged = true;
    };
  },
      progressDrag = _Draggable_js__WEBPACK_IMPORTED_MODULE_0__["Draggable"].create(playhead, {
    type: "x",
    cursor: "ew-resize",
    allowNativeTouchScrolling: false,
    allowEventDefault: true,
    //otherwise, when dragged outside an iframe, the mouseup doesn't bubble up so it could seem "stuck" to the mouse.
    onPress: onPressTimeline(playhead, 0.5, true),
    onDrag: function onDrag() {
      var time = timeAtDragStart + pixelToTimeRatio * this.x;

      if (time < 0) {
        time = 0;
      } else if (time > linkedAnimation._dur) {
        time = linkedAnimation._dur;
      }

      if (!skipDragUpdates) {
        linkedAnimation.time(time);
      }

      progressBar.style.width = Math.min(outProgress - inProgress, Math.max(0, time / linkedAnimation._dur * 100 - inProgress)) + "%";
      timeLabel.innerHTML = time.toFixed(2);
    },
    onRelease: function onRelease() {
      if (!paused) {
        linkedAnimation.resume();
      }
    }
  })[0],
      resetInOut = function resetInOut() {
    inProgress = 0;
    outProgress = 100;
    inPoint.style.left = "0%";
    outPoint.style.left = "100%";
    record("in", inProgress);
    record("out", outProgress);
    updateProgress(true);
  },
      inDrag = _Draggable_js__WEBPACK_IMPORTED_MODULE_0__["Draggable"].create(inPoint, {
    type: "x",
    cursor: "ew-resize",
    zIndexBoost: false,
    allowNativeTouchScrolling: false,
    allowEventDefault: true,
    //otherwise, when dragged outside an iframe, the mouseup doesn't bubble up so it could seem "stuck" to the mouse.
    onPress: onPressTimeline(inPoint, 1, true),
    onDoubleClick: resetInOut,
    onDrag: function onDrag() {
      inProgress = (timeAtDragStart + pixelToTimeRatio * this.x) / linkedAnimation.duration() * 100;
      linkedAnimation.progress(inProgress / 100);
      updateProgress(true);
    },
    onRelease: function onRelease() {
      if (inProgress < 0) {
        inProgress = 0;
      }

      _clearSelection(); //for responsiveness, convert the px-based transform into %-based left position.


      inPoint.style.left = inProgress + "%";
      record("in", inProgress);
      gsap.set(inPoint, {
        x: 0,
        data: "root",
        display: "block"
      }); //set display:block so that it remains visible even when the minimal skin is enabled.

      if (!paused) {
        linkedAnimation.resume();
      }
    }
  })[0],
      outDrag = _Draggable_js__WEBPACK_IMPORTED_MODULE_0__["Draggable"].create(outPoint, {
    type: "x",
    cursor: "ew-resize",
    allowNativeTouchScrolling: false,
    allowEventDefault: true,
    //otherwise, when dragged outside an iframe, the mouseup doesn't bubble up so it could seem "stuck" to the mouse.
    zIndexBoost: false,
    onPress: onPressTimeline(outPoint, 0, true),
    onDoubleClick: resetInOut,
    onDrag: function onDrag() {
      outProgress = (timeAtDragStart + pixelToTimeRatio * this.x) / linkedAnimation.duration() * 100;
      linkedAnimation.progress(outProgress / 100);
      updateProgress(true);
    },
    onRelease: function onRelease() {
      if (outProgress > 100) {
        outProgress = 100;
      }

      _clearSelection(); //for responsiveness, convert the px-based transform into %-based left position.


      outPoint.style.left = outProgress + "%";
      record("out", outProgress);
      gsap.set(outPoint, {
        x: 0,
        data: "root",
        display: "block"
      }); //set display:block so that it remains visible even when the minimal skin is enabled.

      if (!pausedWhenDragStarted) {
        play();
        linkedAnimation.resume();
      }
    }
  })[0],
      updateProgress = function updateProgress(force) {
    // NOTE: "force" is actually the "time" when this method gets called by the gsap.ticker!
    if (progressDrag.isPressed && force !== true) {
      return;
    }

    var p = !loopEnabled && selectedAnimation._repeat === -1 ? selectedAnimation.totalTime() / selectedAnimation.duration() * 100 : linkedAnimation.progress() * 100 || 0,
        repeatDelayPhase = selectedAnimation._repeat && selectedAnimation._rDelay && selectedAnimation.totalTime() % (selectedAnimation.duration() + selectedAnimation._rDelay) > selectedAnimation.duration(),
        target;

    if (p > 100) {
      p = 100;
    }

    if (p >= outProgress) {
      if (loopEnabled && !linkedAnimation.paused() && !progressDrag.isDragging) {
        if (!repeatDelayPhase) {
          p = inProgress;
          target = linkedAnimation._targets && linkedAnimation._targets[0];

          if (target === selectedAnimation) {
            //in case there are callbacks on the timeline, when we jump back to the start we should seek() so that the playhead doesn't drag [backward] past those and trigger them.
            target.seek(startTime + (endTime - startTime) * inProgress / 100);
          }

          if (selectedAnimation._repeat > 0 && !inProgress && outProgress === 100) {
            if (selectedAnimation.totalProgress() === 1) {
              linkedAnimation.totalProgress(0, true).resume();
            }
          } else {
            linkedAnimation.progress(p / 100, true).resume();
          }
        }
      } else {
        if (p !== outProgress || selectedAnimation._repeat === -1) {
          p = outProgress;
          linkedAnimation.progress(p / 100);
        }

        if (!paused && (outProgress < 100 || selectedAnimation.totalProgress() === 1 || selectedAnimation._repeat === -1)) {
          pause();
        }
      }
    } else if (p < inProgress) {
      p = inProgress;
      linkedAnimation.progress(p / 100, true);
    }

    if (p !== progress || force === true) {
      progressBar.style.left = inProgress + "%";
      progressBar.style.width = Math.max(0, p - inProgress) + "%";
      playhead.style.left = p + "%";
      timeLabel.innerHTML = linkedAnimation._time.toFixed(2);
      durationLabel.innerHTML = linkedAnimation._dur.toFixed(2);

      if (dragged) {
        playhead.style.transform = "translate(-50%,0)";
        playhead._gsap.x = "0px";
        playhead._gsap.xPercent = -50;
        dragged = false;
      }

      progress = p;
    } else if (linkedAnimation.paused() !== paused) {
      //like if the user has an addPause() in the middle of the animation.
      togglePlayPause();
    }
  },
      onPressSeekBar = function onPressSeekBar(e) {
    if (progressDrag.isPressed) {
      return;
    }

    var bounds = e.target.getBoundingClientRect(),
        x = (e.changedTouches ? e.changedTouches[0] : e).clientX,
        p = (x - bounds.left) / bounds.width * 100;

    if (p < inProgress) {
      inProgress = p = Math.max(0, p);
      inPoint.style.left = inProgress + "%";
      inDrag.startDrag(e);
      return;
    } else if (p > outProgress) {
      outProgress = p = Math.min(100, p);
      outPoint.style.left = outProgress + "%";
      outDrag.startDrag(e);
      return;
    }

    linkedAnimation.progress(p / 100).pause();
    updateProgress(true);
    progressDrag.startDrag(e);
  },
      //PLAY/PAUSE button
  play = function play() {
    if (linkedAnimation.progress() >= outProgress / 100) {
      _checkIndependence(linkedAnimation, vars);

      var target = linkedAnimation._targets && linkedAnimation._targets[0];

      if (target === selectedAnimation) {
        //in case there are callbacks on the timeline, when we jump back to the start we should seek() so that the playhead doesn't drag [backward] past those and trigger them.
        target.seek(startTime + (endTime - startTime) * inProgress / 100);
      }

      if (linkedAnimation._repeat && !inProgress) {
        linkedAnimation.totalProgress(0, true); //for repeating animations, don't get stuck in the last iteration - jump all the way back to the start.
      } else if (!linkedAnimation.reversed()) {
        linkedAnimation.progress(inProgress / 100, true);
      }
    }

    playPauseMorph.play();
    linkedAnimation.resume();

    if (paused) {
      _self.update();
    }

    paused = false;
  },
      pause = function pause() {
    playPauseMorph.reverse();

    if (linkedAnimation) {
      linkedAnimation.pause();
    }

    paused = true;
  },
      togglePlayPause = function togglePlayPause() {
    if (paused) {
      play();
    } else {
      pause();
    }
  },
      //REWIND button
  onPressRewind = function onPressRewind(e) {
    if (progressDrag.isPressed) {
      return;
    } //_self.update();


    _checkIndependence(linkedAnimation, vars);

    var target = linkedAnimation._targets && linkedAnimation._targets[0];

    if (target === selectedAnimation) {
      //in case there are callbacks on the timeline, when we jump back to the start we should seek() so that the playhead doesn't drag [backward] past those and trigger them.
      target.seek(startTime + (endTime - startTime) * inProgress / 100);
    }

    linkedAnimation.progress(inProgress / 100, true);

    if (!paused) {
      linkedAnimation.resume();
    }
  },
      //LOOP button
  loop = function loop(value) {
    loopEnabled = value;
    record("loop", loopEnabled);

    if (loopEnabled) {
      loopAnimation.play();

      if (linkedAnimation.progress() >= outProgress / 100) {
        var target = linkedAnimation._targets && linkedAnimation._targets[0];

        if (target === selectedAnimation) {
          //in case there are callbacks on the timeline, when we jump back to the start we should seek() so that the playhead doesn't drag [backward] past those and trigger them.
          target.seek(startTime + (endTime - startTime) * inProgress / 100);
        }

        if (selectedAnimation._repeat && !inProgress && outProgress === 100) {
          linkedAnimation.totalProgress(0, true);
        } else {
          linkedAnimation.progress(inProgress / 100, true);
        }

        play();
      }
    } else {
      loopAnimation.reverse();
    }
  },
      toggleLoop = function toggleLoop() {
    return loop(!loopEnabled);
  },
      //ANIMATIONS list
  updateList = function updateList() {
    var animations = _getChildrenOf(declaredAnimation && !vars.globalSync ? declaredAnimation : _recordedRoot, true),
        options = list.children,
        matches = 0,
        option,
        i;

    if (declaredAnimation && !vars.globalSync) {
      animations.unshift(declaredAnimation);
    } else if (!vars.hideGlobalTimeline) {
      animations.unshift(_recordedRoot);
    }

    for (i = 0; i < animations.length; i++) {
      option = options[i] || _createElement("option", list);
      option.animation = animations[i];
      matches = i && animations[i].vars.id === animations[i - 1].vars.id ? matches + 1 : 0;
      option.setAttribute("value", option.innerHTML = animations[i].vars.id + (matches ? " [" + matches + "]" : animations[i + 1] && animations[i + 1].vars.id === animations[i].vars.id ? " [0]" : ""));
    }

    for (; i < options.length; i++) {
      list.removeChild(options[i]);
    }
  },
      animation = function animation(anim) {
    var ts = parseFloat(timeScale.options[timeScale.selectedIndex].value) || 1,
        tl,
        maxDuration;

    if (!arguments.length) {
      return selectedAnimation;
    }

    if (_isString(anim)) {
      anim = _getAnimationById(anim);
    } //console.log("animation() ", anim.vars.id);


    if (!(anim instanceof Animation)) {
      console.warn("GSDevTools error: invalid animation.");
    }

    if (anim === selectedAnimation) {
      return;
    }

    if (selectedAnimation) {
      selectedAnimation._inProgress = inProgress;
      selectedAnimation._outProgress = outProgress;
    }

    selectedAnimation = anim;

    if (linkedAnimation) {
      ts = linkedAnimation.timeScale();

      if (linkedAnimation._targets && linkedAnimation._targets[0] === declaredAnimation) {
        declaredAnimation.resume();
        linkedAnimation.kill();
      }
    }

    inProgress = selectedAnimation._inProgress || 0;
    outProgress = selectedAnimation._outProgress || 100;
    inPoint.style.left = inProgress + "%";
    outPoint.style.left = outProgress + "%";

    if (_fullyInitialized) {
      //don't record inProgress/outProgress unless we're fully instantiated because people may call GSDevTools.create() before creating/defining their animations, thus the inTime/outTime may not exist yet.
      record("animation", selectedAnimation.vars.id);
      record("in", inProgress);
      record("out", outProgress);
    }

    startTime = 0;
    maxDuration = vars.maxDuration || Math.min(1000, _getClippedDuration(selectedAnimation));

    if (selectedAnimation === _recordedRoot || vars.globalSync) {
      _merge();

      linkedAnimation = _rootTween;

      if (_rootInstance && _rootInstance !== _self) {
        console.warn("Error: GSDevTools can only have one instance that's globally synchronized.");
      }

      _rootInstance = _self; //_recording = true;

      if (selectedAnimation !== _recordedRoot) {
        tl = selectedAnimation;
        endTime = tl.totalDuration();

        if (endTime > 99999999) {
          //in the case of an infinitely repeating animation, just use a single iteration's duration instead.
          endTime = tl.duration();
        }

        while (tl.parent.parent) {
          startTime = startTime / tl._ts + tl._start;
          endTime = endTime / tl._ts + tl._start;
          tl = tl.parent;
        }
      } else {
        endTime = _recordedRoot.duration();
      }

      if (endTime - startTime > maxDuration) {
        //cap end time at 1000 because it doesn't seem reasonable to accommodate super long stuff.
        endTime = startTime + maxDuration;
      }

      _recordedRoot.pause(startTime);

      _rootTween.vars.time = endTime;

      _rootTween.invalidate();

      _rootTween.duration(endTime - startTime).timeScale(ts); //wait for a tick before starting because some browsers freeze things immediately following a <select> selection, like on MacOS it flashes a few times before disappearing, so this prevents a "jump".


      if (paused) {
        //jump forward and then back in order to make sure the start/end values are recorded internally right away and don't drift outside this tween.
        _rootTween.progress(1).pause(0);
      } else {
        _delayedCall(0.01, function () {
          _rootTween.resume().progress(inProgress / 100);

          if (paused) {
            play();
          }
        });
      }
    } else {
      if (_rootInstance === _self) {
        _rootInstance = null;
      }

      if (selectedAnimation === declaredAnimation || !declaredAnimation) {
        linkedAnimation = selectedAnimation;

        if (!loopEnabled && linkedAnimation._repeat) {
          loop(true);
        }
      } else {
        //if an animation is declared in the config object, and the user chooses a sub-animation (nested), we tween the playhead of the declaredAnimation to keep everything synchronized even though globalSync isn't true.
        tl = selectedAnimation;
        endTime = tl.totalDuration();

        if (endTime > 99999999) {
          //in the case of an infinitely repeating animation, just use a single iteration's duration instead.
          endTime = tl.duration();
        }

        while (tl.parent.parent && tl !== declaredAnimation) {
          startTime = startTime / (tl._ts || tl._pauseTS) + tl._start;
          endTime = endTime / (tl._ts || tl._pauseTS) + tl._start;
          tl = tl.parent;
        }

        if (endTime - startTime > maxDuration) {
          //cap end time at 1000 because it doesn't seem reasonable to accommodate super long stuff.
          endTime = startTime + maxDuration;
        }

        declaredAnimation.pause(startTime);
        linkedAnimation = gsap.to(declaredAnimation, {
          duration: endTime - startTime,
          time: endTime,
          ease: "none",
          data: "root",
          parent: _independentRoot
        });
      }

      linkedAnimation.timeScale(ts);

      _rootTween.pause();

      _recordedRoot.resume();

      linkedAnimation.seek(0);
    }

    durationLabel.innerHTML = linkedAnimation.duration().toFixed(2);

    _selectValue(list, selectedAnimation.vars.id, animationLabel);
  },
      updateRootDuration = function updateRootDuration() {
    var time, ratio, duration;

    if (selectedAnimation === _recordedRoot) {
      time = _recordedRoot._time;

      _recordedRoot.progress(1, true).time(time, true); //jump to the end and back again because sometimes a tween that hasn't rendered yet will affect duration, like a TimelineMax.tweenTo() where the duration gets set in the onStart.


      time = (_rootTween._dp._time - _rootTween._start) * _rootTween._ts;
      duration = Math.min(1000, _recordedRoot.duration());

      if (duration === 1000) {
        duration = Math.min(1000, _getClippedDuration(_recordedRoot));
      }

      ratio = _rootTween.duration() / duration;

      if (ratio !== 1 && duration) {
        inProgress *= ratio;

        if (outProgress < 100) {
          outProgress *= ratio;
        }

        _rootTween.seek(0);

        _rootTween.vars.time = duration;

        _rootTween.invalidate();

        _rootTween.duration(duration);

        _rootTween.time(time);

        durationLabel.innerHTML = duration.toFixed(2);
        updateProgress(true);
      }
    }
  },
      onChangeAnimation = function onChangeAnimation(e) {
    animation(list.options[list.selectedIndex].animation);

    if (e.target && e.target.blur) {
      //so that if an option is selected, and then the user tries to hit the up/down arrow, it doesn't just try selecting something else in the <select>.
      e.target.blur();
    }

    if (paused) {
      play();
    }
  },
      //TIMESCALE button
  onChangeTimeScale = function onChangeTimeScale(e) {
    var ts = parseFloat(timeScale.options[timeScale.selectedIndex].value) || 1,
        target;
    linkedAnimation.timeScale(ts);
    record("timeScale", ts);

    if (!paused) {
      if (linkedAnimation.progress() >= outProgress / 100) {
        target = linkedAnimation._targets && linkedAnimation._targets[0];

        if (target === selectedAnimation) {
          //in case there are callbacks on the timeline, when we jump back to the start we should seek() so that the playhead doesn't drag [backward] past those and trigger them.
          target.seek(startTime + (endTime - startTime) * inProgress / 100);
        }

        linkedAnimation.progress(inProgress / 100, true).pause();
      } else {
        linkedAnimation.pause();
      }

      _delayedCall(0.01, function () {
        return linkedAnimation.resume();
      });
    }

    timeScaleLabel.innerHTML = ts + "x";

    if (timeScale.blur) {
      //so that if an option is selected, and then the user tries to hit the up/down arrow, it doesn't just try selecting something else in the <select>.
      timeScale.blur();
    }
  },
      //AUTOHIDE
  autoHideTween = gsap.to([find(".gs-bottom"), find(".gs-top")], {
    duration: 0.3,
    autoAlpha: 0,
    y: 50,
    ease: "power2.in",
    data: "root",
    paused: true,
    parent: _independentRoot
  }),
      hidden = false,
      onMouseOut = function onMouseOut(e) {
    if (!_Draggable_js__WEBPACK_IMPORTED_MODULE_0__["Draggable"].hitTest(e, root) && !progressDrag.isDragging && !inDrag.isDragging && !outDrag.isDragging) {
      autoHideDelayedCall.restart(true);
    }
  },
      hide = function hide() {
    if (!hidden) {
      autoHideTween.play();
      autoHideDelayedCall.pause();
      hidden = true;
    }
  },
      show = function show() {
    autoHideDelayedCall.pause();

    if (hidden) {
      autoHideTween.reverse();
      hidden = false;
    }
  },
      toggleHide = function toggleHide() {
    if (hidden) {
      show();
    } else {
      hide();
    }
  },
      autoHideDelayedCall = _delayedCall(1.3, hide).pause(),
      initialize = function initialize(preliminary) {
    //if on startup, someone does a timeline.seek(), we must honor it, so when initialize() is called, we record _recordedRoot._start so that we can use that as an offset. Remember, however, that we call initialize() twice on startup, once after a tick has elapsed just in case someone called GSDevTools.create() before their animation code, so we must record the value (once).
    if (_startupPhase && !_globalStartTime) {
      _globalStartTime = _recordedRoot._start;
    }

    _fullyInitialized = !preliminary;
    declaredAnimation = _parseAnimation(vars.animation);

    if (declaredAnimation && !declaredAnimation.vars.id) {
      declaredAnimation.vars.id = "[no id]";
    }

    _merge();

    updateList();

    var savedAnimation = _getAnimationById(recall("animation"));

    if (savedAnimation) {
      savedAnimation._inProgress = recall("in") || 0;
      savedAnimation._outProgress = recall("out") || 100;
    }

    if (vars.paused) {
      pause();
    }

    selectedAnimation = null;
    animation(declaredAnimation || savedAnimation || _recordedRoot);
    var ts = vars.timeScale || recall("timeScale"),
        savedInOut = savedAnimation === selectedAnimation;

    if (ts) {
      _selectValue(timeScale, ts, timeScaleLabel, ts + "x");

      linkedAnimation.timeScale(ts);
    }

    inProgress = ("inTime" in vars ? _timeToProgress(vars.inTime, selectedAnimation, 0, 0) : savedInOut ? savedAnimation._inProgress : 0) || 0;

    if (inProgress === 100 && !vars.animation && savedAnimation) {
      //in case there's a recorded animation (sessionStorage) and then the user defines an inTime that exceeds that animation's duration, just default back to the Global Timeline. Otherwise the in/out point will be at the very end and it'd be weird.
      animation(_recordedRoot);
      inProgress = _timeToProgress(vars.inTime, selectedAnimation, 0, 0) || 0;
    }

    if (inProgress) {
      inPoint.style.left = inProgress + "%";
      inPoint.style.display = outPoint.style.display = "block"; //set display:block so that it remains visible even when the minimal skin is enabled.
    }

    outProgress = ("outTime" in vars ? _timeToProgress(vars.outTime, selectedAnimation, 100, inProgress) : savedInOut ? savedAnimation._outProgress : 0) || 100;

    if (outProgress < inProgress) {
      outProgress = 100;
    }

    if (outProgress !== 100) {
      outPoint.style.left = outProgress + "%";
      inPoint.style.display = outPoint.style.display = "block"; //set display:block so that it remains visible even when the minimal skin is enabled.
    }

    loopEnabled = "loop" in vars ? vars.loop : recall("loop");

    if (loopEnabled) {
      loop(true);
    }

    if (vars.paused) {
      linkedAnimation.progress(inProgress / 100, true).pause();
    }

    if (_startupPhase && selectedAnimation === _recordedRoot && _globalStartTime && vars.globalSync && !paused) {
      linkedAnimation.time(-_globalStartTime, true);
    }

    updateProgress(true);
  }; //INITIALIZATION TASKS


  _addListener(list, "change", onChangeAnimation);

  _addListener(list, "mousedown", updateList);

  _addListener(playPauseButton, "mousedown", togglePlayPause);

  _addListener(find(".seek-bar"), "mousedown", onPressSeekBar);

  _addListener(find(".rewind"), "mousedown", onPressRewind);

  _addListener(loopButton, "mousedown", toggleLoop);

  _addListener(timeScale, "change", onChangeTimeScale);

  if (vars.visibility === "auto") {
    _addListener(root, "mouseout", onMouseOut); //_addListener(find(".gs-hit-area"), "mouseover", show);


    _addListener(root, "mouseover", show);
  } else if (vars.visibility === "hidden") {
    hidden = true;
    autoHideTween.progress(1);
  }

  if (vars.keyboard !== false) {
    if (_keyboardInstance && vars.keyboard) {
      console.warn("[GSDevTools warning] only one instance can be affected by keyboard shortcuts. There is already one active.");
    } else {
      _keyboardInstance = _self; //we can't have multiple instances all affected by the keyboard.

      keyboardHandler = function keyboardHandler(e) {
        //window.parent allows things to work inside of an iframe, like on codepen.
        var key = e.keyCode ? e.keyCode : e.which,
            ts;

        if (key === 32) {
          //spacebar
          togglePlayPause();
        } else if (key === 38) {
          //up arrow
          ts = parseFloat(_shiftSelectedValue(timeScale, -1, timeScaleLabel));
          linkedAnimation.timeScale(ts);
          record("timeScale", ts);
        } else if (key === 40) {
          //down arrow
          ts = parseFloat(_shiftSelectedValue(timeScale, 1, timeScaleLabel));
          linkedAnimation.timeScale(ts);
          record("timeScale", ts);
        } else if (key === 37) {
          //left arrow
          onPressRewind(e);
        } else if (key === 39) {
          //right arrow
          linkedAnimation.progress(outProgress / 100);
        } else if (key === 76) {
          //"L" key
          toggleLoop();
        } else if (key === 72) {
          //"H" key
          toggleHide();
        } else if (key === 73) {
          //"I" key
          inProgress = linkedAnimation.progress() * 100;
          record("in", inProgress);
          inPoint.style.left = inProgress + "%";
          updateProgress(true);
        } else if (key === 79) {
          //"O" key
          outProgress = linkedAnimation.progress() * 100;
          record("out", outProgress);
          outPoint.style.left = outProgress + "%";
          updateProgress(true);
        }
      };

      _addListener(_docEl, "keydown", keyboardHandler);
    }
  }

  gsap.set(playhead, {
    xPercent: -50,
    x: 0,
    data: "root"
  }); //so that when we drag, x is properly discerned (browsers report in pure pixels rather than percents)

  gsap.set(inPoint, {
    xPercent: -100,
    x: 0,
    data: "root"
  });
  inPoint._gsIgnore = outPoint._gsIgnore = playhead._gsIgnore = playPauseButton._gsIgnore = loopButton._gsIgnore = true; //Draggable fires off a TweenLite.set() that affects the transforms, and we don't want them to get into the _recordedRoot, so kill those tweens.

  gsap.killTweensOf([inPoint, outPoint, playhead]);
  initialize(_startupPhase);

  if (_startupPhase) {
    //developers may call GSDevTools.create() before they even create some of their animations, so the inTime/outTime or animation values may not exist, thus we wait for 1 tick and initialize again, just in case.
    _delayedCall(0.0001, initialize, [false], this);
  }

  gsap.ticker.add(updateProgress);

  this.update = function (forceMerge) {
    if (_rootInstance === _self) {
      if (!_rootTween.paused() || forceMerge) {
        _merge();
      }

      updateRootDuration();
    }
  };

  this.kill = function () {
    _removeListener(list, "change", onChangeAnimation);

    _removeListener(list, "mousedown", updateList);

    _removeListener(playPauseButton, "mousedown", togglePlayPause);

    _removeListener(find(".seek-bar"), "mousedown", onPressSeekBar);

    _removeListener(find(".rewind"), "mousedown", onPressRewind);

    _removeListener(loopButton, "mousedown", toggleLoop);

    _removeListener(timeScale, "change", onChangeTimeScale);

    progressDrag.disable();
    inDrag.disable();
    outDrag.disable();
    gsap.ticker.remove(updateProgress);

    _removeListener(root, "mouseout", onMouseOut);

    _removeListener(root, "mouseover", show);

    _removeListener(_docEl, "keydown", keyboardHandler);

    root.parentNode.removeChild(root);

    if (_rootInstance === _self) {
      _rootInstance = null;
    }

    delete _lookup[vars.id + ""];
  };

  this.minimal = function (value) {
    var isMinimal = root.classList.contains("minimal"),
        p;

    if (!arguments.length || isMinimal === value) {
      return isMinimal;
    }

    if (value) {
      root.classList.add("minimal");
    } else {
      root.classList.remove("minimal");
    }

    if (vars.container) {
      root.style.top = value ? "calc(100% - 42px)" : "calc(100% - 51px)";
    }

    if (progressDrag.isPressed) {
      skipDragUpdates = true; //just in case there's actually a tween/timeline in the linkedAnimation that is altering this GSDevTool instance's "minimal()" value, it could trigger a recursive loop in the drag handlers, like if they update linkedAnimation's time/progress which in turn triggers this minimal() function which in turn dues the same, and so on.

      progressDrag.endDrag(progressDrag.pointerEvent);
      skipDragUpdates = false;
      p = linkedAnimation.progress() * 100;
      progressBar.style.width = Math.max(0, p - inProgress) + "%";
      playhead.style.left = p + "%";
      playhead.style.transform = "translate(-50%,0)";
      playhead._gsap.x = "0px";
      playhead._gsap.xPercent = -50;
      progressDrag.startDrag(progressDrag.pointerEvent, true);
    }
  }; //expose methods:


  this.animation = animation;
  this.updateList = updateList;
}; //if on startup, someone does a timeline.seek(), we need to honor it, so when initialize() is called, it'll check the _recordedRoot._start so that we can use that as an offset. Remember, however, that we call initialize() twice on startup, once after a tick has elapsed just in case someone called GSDevTools.create() before their animation code, so we must record the value (once).


GSDevTools.version = "3.1.1";
GSDevTools.globalRecordingTime = 2;

GSDevTools.getById = function (id) {
  return id ? _lookup[id] : _rootInstance;
};

GSDevTools.getByAnimation = function (animation) {
  if (_isString(animation)) {
    animation = gsap.getById(animation);
  }

  for (var p in _lookup) {
    if (_lookup[p].animation() === animation) {
      return _lookup[p];
    }
  }
};

GSDevTools.create = function (vars) {
  return new GSDevTools(vars);
};

GSDevTools.register = _initCore;
_getGSAP() && gsap.registerPlugin(GSDevTools);


/***/ }),

/***/ "./node_modules/gsap/utils/matrix.js":
/*!*******************************************!*\
  !*** ./node_modules/gsap/utils/matrix.js ***!
  \*******************************************/
/*! exports provided: Matrix2D, getGlobalMatrix */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Matrix2D", function() { return Matrix2D; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getGlobalMatrix", function() { return getGlobalMatrix; });
/*!
 * matrix 3.1.1
 * https://greensock.com
 *
 * Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var _doc,
    _win,
    _docElement,
    _body,
    _divContainer,
    _svgContainer,
    _identityMatrix,
    _transformProp = "transform",
    _transformOriginProp = _transformProp + "Origin",
    _setDoc = function _setDoc(element) {
  var doc = element.ownerDocument || element;

  if (!(_transformProp in element.style) && "msTransform" in element.style) {
    //to improve compatibility with old Microsoft browsers
    _transformProp = "msTransform";
    _transformOriginProp = _transformProp + "Origin";
  }

  while (doc.parentNode && (doc = doc.parentNode)) {}

  _win = window;
  _identityMatrix = new Matrix2D();

  if (doc) {
    _doc = doc;
    _docElement = doc.documentElement;
    _body = doc.body;
  }

  return doc;
},
    _svgTemps = [],
    //we create 3 elements for SVG, and 3 for other DOM elements and cache them for performance reasons. They get nested in _divContainer and _svgContainer so that just one element is added to the DOM on each successive attempt. Again, performance is key.
_divTemps = [],
    _getDocScrollTop = function _getDocScrollTop() {
  return _win.pageYOffset || _doc.scrollTop || _docElement.scrollTop || _body.scrollTop || 0;
},
    _getDocScrollLeft = function _getDocScrollLeft() {
  return _win.pageXOffset || _doc.scrollLeft || _docElement.scrollLeft || _body.scrollLeft || 0;
},
    _svgOwner = function _svgOwner(element) {
  return element.ownerSVGElement || ((element.tagName + "").toLowerCase() === "svg" ? element : null);
},
    _isFixed = function _isFixed(element) {
  if (_win.getComputedStyle(element).position === "fixed") {
    return true;
  }

  element = element.parentNode;

  if (element && element.nodeType === 1) {
    // avoid document fragments which will throw an error.
    return _isFixed(element);
  }
},
    _createSibling = function _createSibling(element, i) {
  if (element.parentNode && (_doc || _setDoc(element))) {
    var svg = _svgOwner(element),
        ns = svg ? svg.getAttribute("xmlns") || "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml",
        type = svg ? i ? "rect" : "g" : "div",
        x = i !== 2 ? 0 : 100,
        y = i === 3 ? 100 : 0,
        css = "position:absolute;display:block;pointer-events:none;",
        e = _doc.createElementNS ? _doc.createElementNS(ns.replace(/^https/, "http"), type) : _doc.createElement(type);

    if (i) {
      if (!svg) {
        if (!_divContainer) {
          _divContainer = _createSibling(element);
          _divContainer.style.cssText = css;
        }

        e.style.cssText = css + "width:1px;height:1px;top:" + y + "px;left:" + x + "px";

        _divContainer.appendChild(e);
      } else {
        if (!_svgContainer) {
          _svgContainer = _createSibling(element);
        }

        e.setAttribute("width", 1);
        e.setAttribute("height", 1);
        e.setAttribute("transform", "translate(" + x + "," + y + ")");

        _svgContainer.appendChild(e);
      }
    }

    return e;
  }

  throw "Need document and parent.";
},
    _placeSiblings = function _placeSiblings(element) {
  var svg = _svgOwner(element),
      isRootSVG = element === svg,
      siblings = svg ? _svgTemps : _divTemps,
      container,
      m,
      b,
      x,
      y;

  if (element === _win) {
    return element;
  }

  if (!siblings.length) {
    siblings.push(_createSibling(element, 1), _createSibling(element, 2), _createSibling(element, 3));
  }

  container = svg ? _svgContainer : _divContainer;

  if (svg) {
    b = isRootSVG ? {
      x: 0,
      y: 0
    } : element.getBBox();
    m = element.transform ? element.transform.baseVal : []; // IE11 doesn't follow the spec.

    if (m.length) {
      m = m.consolidate().matrix;
      x = m.a * b.x + m.c * b.y;
      y = m.b * b.x + m.d * b.y;
    } else {
      m = _identityMatrix;
      x = b.x;
      y = b.y;
    }

    if (element.tagName.toLowerCase() === "g") {
      x = y = 0;
    }

    container.setAttribute("transform", "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + (m.e + x) + "," + (m.f + y) + ")");
    (isRootSVG ? svg : element.parentNode).appendChild(container);
  } else {
    container.style.top = element.offsetTop + "px";
    container.style.left = element.offsetLeft + "px";
    m = _win.getComputedStyle(element);
    container.style[_transformProp] = m[_transformProp];
    container.style[_transformOriginProp] = m[_transformOriginProp];
    container.style.position = m.position === "fixed" ? "fixed" : "absolute";
    element.parentNode.appendChild(container);
  }

  return container;
},
    _setMatrix = function _setMatrix(m, a, b, c, d, e, f) {
  m.a = a;
  m.b = b;
  m.c = c;
  m.d = d;
  m.e = e;
  m.f = f;
  return m;
};

var Matrix2D =
/*#__PURE__*/
function () {
  function Matrix2D(a, b, c, d, e, f) {
    if (a === void 0) {
      a = 1;
    }

    if (b === void 0) {
      b = 0;
    }

    if (c === void 0) {
      c = 0;
    }

    if (d === void 0) {
      d = 1;
    }

    if (e === void 0) {
      e = 0;
    }

    if (f === void 0) {
      f = 0;
    }

    _setMatrix(this, a, b, c, d, e, f);
  }

  var _proto = Matrix2D.prototype;

  _proto.inverse = function inverse() {
    var a = this.a,
        b = this.b,
        c = this.c,
        d = this.d,
        e = this.e,
        f = this.f,
        determinant = a * d - b * c;
    return _setMatrix(this, d / determinant, -b / determinant, -c / determinant, a / determinant, (c * f - d * e) / determinant, -(a * f - b * e) / determinant);
  };

  _proto.multiply = function multiply(matrix) {
    var a = this.a,
        b = this.b,
        c = this.c,
        d = this.d,
        e = this.e,
        f = this.f,
        a2 = matrix.a,
        b2 = matrix.c,
        c2 = matrix.b,
        d2 = matrix.d,
        e2 = matrix.e,
        f2 = matrix.f;
    return _setMatrix(this, a2 * a + c2 * c, a2 * b + c2 * d, b2 * a + d2 * c, b2 * b + d2 * d, e + e2 * a + f2 * c, f + e2 * b + f2 * d);
  };

  _proto.equals = function equals(matrix) {
    var a = this.a,
        b = this.b,
        c = this.c,
        d = this.d,
        e = this.e,
        f = this.f;
    return a === matrix.a && b === matrix.b && c === matrix.c && d === matrix.d && e === matrix.e && f === matrix.f;
  };

  _proto.apply = function apply(point, decoratee) {
    if (decoratee === void 0) {
      decoratee = {};
    }

    var x = point.x,
        y = point.y,
        a = this.a,
        b = this.b,
        c = this.c,
        d = this.d,
        e = this.e,
        f = this.f;
    decoratee.x = x * a + y * c + e;
    decoratee.y = x * b + y * d + f;
    return decoratee;
  };

  return Matrix2D;
}(); //feed in an element and it'll return a 2D matrix (optionally inverted) so that you can translate between coordinate spaces.
// Inverting lets you translate a global point into a local coordinate space. No inverting lets you go the other way.
// We needed this to work around various browser bugs, like Firefox doesn't accurately report getScreenCTM() when there
// are transforms applied to ancestor elements.
// The matrix math to convert any x/y coordinate is:
//     tx = m.a * x + m.c * y + m.e
//     ty = m.b * x + m.d * y + m.f

function getGlobalMatrix(element, inverse) {
  if (!element || !element.parentNode) {
    return new Matrix2D();
  }

  var svg = _svgOwner(element),
      temps = svg ? _svgTemps : _divTemps,
      container = _placeSiblings(element),
      b1 = temps[0].getBoundingClientRect(),
      b2 = temps[1].getBoundingClientRect(),
      b3 = temps[2].getBoundingClientRect(),
      parent = container.parentNode,
      isFixed = _isFixed(element),
      m = new Matrix2D((b2.left - b1.left) / 100, (b2.top - b1.top) / 100, (b3.left - b1.left) / 100, (b3.top - b1.top) / 100, b1.left + (isFixed ? 0 : _getDocScrollLeft()), b1.top + (isFixed ? 0 : _getDocScrollTop()));

  parent.removeChild(container);
  return inverse ? m.inverse() : m;
}

/***/ })

}]);
//# sourceMappingURL=vendor.js.map