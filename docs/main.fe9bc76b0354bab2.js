"use strict";
(self.webpackChunkstock_tracker = self.webpackChunkstock_tracker || []).push([
  [179],
  {
    17: () => {
      function nr(n) {
        return "function" == typeof n;
      }
      let vo = !1;
      const Bt = {
        Promise: void 0,
        set useDeprecatedSynchronousErrorHandling(n) {
          if (n) {
            const t = new Error();
            console.warn(
              "DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" +
                t.stack
            );
          } else
            vo &&
              console.log(
                "RxJS: Back to a better error behavior. Thank you. <3"
              );
          vo = n;
        },
        get useDeprecatedSynchronousErrorHandling() {
          return vo;
        },
      };
      function rr(n) {
        setTimeout(() => {
          throw n;
        }, 0);
      }
      const Js = {
          closed: !0,
          next(n) {},
          error(n) {
            if (Bt.useDeprecatedSynchronousErrorHandling) throw n;
            rr(n);
          },
          complete() {},
        },
        si = Array.isArray || ((n) => n && "number" == typeof n.length);
      function zu(n) {
        return null !== n && "object" == typeof n;
      }
      const ea = (() => {
        function n(t) {
          return (
            Error.call(this),
            (this.message = t
              ? `${t.length} errors occurred during unsubscription:\n${t
                  .map((e, r) => `${r + 1}) ${e.toString()}`)
                  .join("\n  ")}`
              : ""),
            (this.name = "UnsubscriptionError"),
            (this.errors = t),
            this
          );
        }
        return (n.prototype = Object.create(Error.prototype)), n;
      })();
      class Se {
        constructor(t) {
          (this.closed = !1),
            (this._parentOrParents = null),
            (this._subscriptions = null),
            t && ((this._ctorUnsubscribe = !0), (this._unsubscribe = t));
        }
        unsubscribe() {
          let t;
          if (this.closed) return;
          let {
            _parentOrParents: e,
            _ctorUnsubscribe: r,
            _unsubscribe: i,
            _subscriptions: o,
          } = this;
          if (
            ((this.closed = !0),
            (this._parentOrParents = null),
            (this._subscriptions = null),
            e instanceof Se)
          )
            e.remove(this);
          else if (null !== e)
            for (let s = 0; s < e.length; ++s) e[s].remove(this);
          if (nr(i)) {
            r && (this._unsubscribe = void 0);
            try {
              i.call(this);
            } catch (s) {
              t = s instanceof ea ? Tp(s.errors) : [s];
            }
          }
          if (si(o)) {
            let s = -1,
              a = o.length;
            for (; ++s < a; ) {
              const l = o[s];
              if (zu(l))
                try {
                  l.unsubscribe();
                } catch (u) {
                  (t = t || []),
                    u instanceof ea ? (t = t.concat(Tp(u.errors))) : t.push(u);
                }
            }
          }
          if (t) throw new ea(t);
        }
        add(t) {
          let e = t;
          if (!t) return Se.EMPTY;
          switch (typeof t) {
            case "function":
              e = new Se(t);
            case "object":
              if (e === this || e.closed || "function" != typeof e.unsubscribe)
                return e;
              if (this.closed) return e.unsubscribe(), e;
              if (!(e instanceof Se)) {
                const o = e;
                (e = new Se()), (e._subscriptions = [o]);
              }
              break;
            default:
              throw new Error(
                "unrecognized teardown " + t + " added to Subscription."
              );
          }
          let { _parentOrParents: r } = e;
          if (null === r) e._parentOrParents = this;
          else if (r instanceof Se) {
            if (r === this) return e;
            e._parentOrParents = [r, this];
          } else {
            if (-1 !== r.indexOf(this)) return e;
            r.push(this);
          }
          const i = this._subscriptions;
          return null === i ? (this._subscriptions = [e]) : i.push(e), e;
        }
        remove(t) {
          const e = this._subscriptions;
          if (e) {
            const r = e.indexOf(t);
            -1 !== r && e.splice(r, 1);
          }
        }
      }
      var n;
      function Tp(n) {
        return n.reduce((t, e) => t.concat(e instanceof ea ? e.errors : e), []);
      }
      Se.EMPTY = (((n = new Se()).closed = !0), n);
      const ta =
        "function" == typeof Symbol
          ? Symbol("rxSubscriber")
          : "@@rxSubscriber_" + Math.random();
      class ye extends Se {
        constructor(t, e, r) {
          switch (
            (super(),
            (this.syncErrorValue = null),
            (this.syncErrorThrown = !1),
            (this.syncErrorThrowable = !1),
            (this.isStopped = !1),
            arguments.length)
          ) {
            case 0:
              this.destination = Js;
              break;
            case 1:
              if (!t) {
                this.destination = Js;
                break;
              }
              if ("object" == typeof t) {
                t instanceof ye
                  ? ((this.syncErrorThrowable = t.syncErrorThrowable),
                    (this.destination = t),
                    t.add(this))
                  : ((this.syncErrorThrowable = !0),
                    (this.destination = new Fp(this, t)));
                break;
              }
            default:
              (this.syncErrorThrowable = !0),
                (this.destination = new Fp(this, t, e, r));
          }
        }
        [ta]() {
          return this;
        }
        static create(t, e, r) {
          const i = new ye(t, e, r);
          return (i.syncErrorThrowable = !1), i;
        }
        next(t) {
          this.isStopped || this._next(t);
        }
        error(t) {
          this.isStopped || ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped || ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed || ((this.isStopped = !0), super.unsubscribe());
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          this.destination.error(t), this.unsubscribe();
        }
        _complete() {
          this.destination.complete(), this.unsubscribe();
        }
        _unsubscribeAndRecycle() {
          const { _parentOrParents: t } = this;
          return (
            (this._parentOrParents = null),
            this.unsubscribe(),
            (this.closed = !1),
            (this.isStopped = !1),
            (this._parentOrParents = t),
            this
          );
        }
      }
      class Fp extends ye {
        constructor(t, e, r, i) {
          super(), (this._parentSubscriber = t);
          let o,
            s = this;
          nr(e)
            ? (o = e)
            : e &&
              ((o = e.next),
              (r = e.error),
              (i = e.complete),
              e !== Js &&
                ((s = Object.create(e)),
                nr(s.unsubscribe) && this.add(s.unsubscribe.bind(s)),
                (s.unsubscribe = this.unsubscribe.bind(this)))),
            (this._context = s),
            (this._next = o),
            (this._error = r),
            (this._complete = i);
        }
        next(t) {
          if (!this.isStopped && this._next) {
            const { _parentSubscriber: e } = this;
            Bt.useDeprecatedSynchronousErrorHandling && e.syncErrorThrowable
              ? this.__tryOrSetError(e, this._next, t) && this.unsubscribe()
              : this.__tryOrUnsub(this._next, t);
          }
        }
        error(t) {
          if (!this.isStopped) {
            const { _parentSubscriber: e } = this,
              { useDeprecatedSynchronousErrorHandling: r } = Bt;
            if (this._error)
              r && e.syncErrorThrowable
                ? (this.__tryOrSetError(e, this._error, t), this.unsubscribe())
                : (this.__tryOrUnsub(this._error, t), this.unsubscribe());
            else if (e.syncErrorThrowable)
              r ? ((e.syncErrorValue = t), (e.syncErrorThrown = !0)) : rr(t),
                this.unsubscribe();
            else {
              if ((this.unsubscribe(), r)) throw t;
              rr(t);
            }
          }
        }
        complete() {
          if (!this.isStopped) {
            const { _parentSubscriber: t } = this;
            if (this._complete) {
              const e = () => this._complete.call(this._context);
              Bt.useDeprecatedSynchronousErrorHandling && t.syncErrorThrowable
                ? (this.__tryOrSetError(t, e), this.unsubscribe())
                : (this.__tryOrUnsub(e), this.unsubscribe());
            } else this.unsubscribe();
          }
        }
        __tryOrUnsub(t, e) {
          try {
            t.call(this._context, e);
          } catch (r) {
            if ((this.unsubscribe(), Bt.useDeprecatedSynchronousErrorHandling))
              throw r;
            rr(r);
          }
        }
        __tryOrSetError(t, e, r) {
          if (!Bt.useDeprecatedSynchronousErrorHandling)
            throw new Error("bad call");
          try {
            e.call(this._context, r);
          } catch (i) {
            return Bt.useDeprecatedSynchronousErrorHandling
              ? ((t.syncErrorValue = i), (t.syncErrorThrown = !0), !0)
              : (rr(i), !0);
          }
          return !1;
        }
        _unsubscribe() {
          const { _parentSubscriber: t } = this;
          (this._context = null),
            (this._parentSubscriber = null),
            t.unsubscribe();
        }
      }
      const bo =
        ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function na(n) {
        return n;
      }
      function xp(n) {
        return 0 === n.length
          ? na
          : 1 === n.length
          ? n[0]
          : function (e) {
              return n.reduce((r, i) => i(r), e);
            };
      }
      let we = (() => {
        class n {
          constructor(e) {
            (this._isScalar = !1), e && (this._subscribe = e);
          }
          lift(e) {
            const r = new n();
            return (r.source = this), (r.operator = e), r;
          }
          subscribe(e, r, i) {
            const { operator: o } = this,
              s = (function GM(n, t, e) {
                if (n) {
                  if (n instanceof ye) return n;
                  if (n[ta]) return n[ta]();
                }
                return n || t || e ? new ye(n, t, e) : new ye(Js);
              })(e, r, i);
            if (
              (s.add(
                o
                  ? o.call(s, this.source)
                  : this.source ||
                    (Bt.useDeprecatedSynchronousErrorHandling &&
                      !s.syncErrorThrowable)
                  ? this._subscribe(s)
                  : this._trySubscribe(s)
              ),
              Bt.useDeprecatedSynchronousErrorHandling &&
                s.syncErrorThrowable &&
                ((s.syncErrorThrowable = !1), s.syncErrorThrown))
            )
              throw s.syncErrorValue;
            return s;
          }
          _trySubscribe(e) {
            try {
              return this._subscribe(e);
            } catch (r) {
              Bt.useDeprecatedSynchronousErrorHandling &&
                ((e.syncErrorThrown = !0), (e.syncErrorValue = r)),
                (function zM(n) {
                  for (; n; ) {
                    const { closed: t, destination: e, isStopped: r } = n;
                    if (t || r) return !1;
                    n = e && e instanceof ye ? e : null;
                  }
                  return !0;
                })(e)
                  ? e.error(r)
                  : console.warn(r);
            }
          }
          forEach(e, r) {
            return new (r = Rp(r))((i, o) => {
              let s;
              s = this.subscribe(
                (a) => {
                  try {
                    e(a);
                  } catch (l) {
                    o(l), s && s.unsubscribe();
                  }
                },
                o,
                i
              );
            });
          }
          _subscribe(e) {
            const { source: r } = this;
            return r && r.subscribe(e);
          }
          [bo]() {
            return this;
          }
          pipe(...e) {
            return 0 === e.length ? this : xp(e)(this);
          }
          toPromise(e) {
            return new (e = Rp(e))((r, i) => {
              let o;
              this.subscribe(
                (s) => (o = s),
                (s) => i(s),
                () => r(o)
              );
            });
          }
        }
        return (n.create = (t) => new n(t)), n;
      })();
      function Rp(n) {
        if ((n || (n = Bt.Promise || Promise), !n))
          throw new Error("no Promise impl found");
        return n;
      }
      const ai = (() => {
        function n() {
          return (
            Error.call(this),
            (this.message = "object unsubscribed"),
            (this.name = "ObjectUnsubscribedError"),
            this
          );
        }
        return (n.prototype = Object.create(Error.prototype)), n;
      })();
      class WM extends Se {
        constructor(t, e) {
          super(),
            (this.subject = t),
            (this.subscriber = e),
            (this.closed = !1);
        }
        unsubscribe() {
          if (this.closed) return;
          this.closed = !0;
          const t = this.subject,
            e = t.observers;
          if (
            ((this.subject = null),
            !e || 0 === e.length || t.isStopped || t.closed)
          )
            return;
          const r = e.indexOf(this.subscriber);
          -1 !== r && e.splice(r, 1);
        }
      }
      class Np extends ye {
        constructor(t) {
          super(t), (this.destination = t);
        }
      }
      let He = (() => {
        class n extends we {
          constructor() {
            super(),
              (this.observers = []),
              (this.closed = !1),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          [ta]() {
            return new Np(this);
          }
          lift(e) {
            const r = new kp(this, this);
            return (r.operator = e), r;
          }
          next(e) {
            if (this.closed) throw new ai();
            if (!this.isStopped) {
              const { observers: r } = this,
                i = r.length,
                o = r.slice();
              for (let s = 0; s < i; s++) o[s].next(e);
            }
          }
          error(e) {
            if (this.closed) throw new ai();
            (this.hasError = !0), (this.thrownError = e), (this.isStopped = !0);
            const { observers: r } = this,
              i = r.length,
              o = r.slice();
            for (let s = 0; s < i; s++) o[s].error(e);
            this.observers.length = 0;
          }
          complete() {
            if (this.closed) throw new ai();
            this.isStopped = !0;
            const { observers: e } = this,
              r = e.length,
              i = e.slice();
            for (let o = 0; o < r; o++) i[o].complete();
            this.observers.length = 0;
          }
          unsubscribe() {
            (this.isStopped = !0), (this.closed = !0), (this.observers = null);
          }
          _trySubscribe(e) {
            if (this.closed) throw new ai();
            return super._trySubscribe(e);
          }
          _subscribe(e) {
            if (this.closed) throw new ai();
            return this.hasError
              ? (e.error(this.thrownError), Se.EMPTY)
              : this.isStopped
              ? (e.complete(), Se.EMPTY)
              : (this.observers.push(e), new WM(this, e));
          }
          asObservable() {
            const e = new we();
            return (e.source = this), e;
          }
        }
        return (n.create = (t, e) => new kp(t, e)), n;
      })();
      class kp extends He {
        constructor(t, e) {
          super(), (this.destination = t), (this.source = e);
        }
        next(t) {
          const { destination: e } = this;
          e && e.next && e.next(t);
        }
        error(t) {
          const { destination: e } = this;
          e && e.error && this.destination.error(t);
        }
        complete() {
          const { destination: t } = this;
          t && t.complete && this.destination.complete();
        }
        _subscribe(t) {
          const { source: e } = this;
          return e ? this.source.subscribe(t) : Se.EMPTY;
        }
      }
      function li(n) {
        return n && "function" == typeof n.schedule;
      }
      function B(n, t) {
        return function (r) {
          if ("function" != typeof n)
            throw new TypeError(
              "argument is not a function. Are you looking for `mapTo()`?"
            );
          return r.lift(new KM(n, t));
        };
      }
      class KM {
        constructor(t, e) {
          (this.project = t), (this.thisArg = e);
        }
        call(t, e) {
          return e.subscribe(new QM(t, this.project, this.thisArg));
        }
      }
      class QM extends ye {
        constructor(t, e, r) {
          super(t),
            (this.project = e),
            (this.count = 0),
            (this.thisArg = r || this);
        }
        _next(t) {
          let e;
          try {
            e = this.project.call(this.thisArg, t, this.count++);
          } catch (r) {
            return void this.destination.error(r);
          }
          this.destination.next(e);
        }
      }
      const Op = (n) => (t) => {
          for (let e = 0, r = n.length; e < r && !t.closed; e++) t.next(n[e]);
          t.complete();
        },
        ra = (function ZM() {
          return "function" == typeof Symbol && Symbol.iterator
            ? Symbol.iterator
            : "@@iterator";
        })(),
        Pp = (n) => n && "number" == typeof n.length && "function" != typeof n;
      function Lp(n) {
        return (
          !!n && "function" != typeof n.subscribe && "function" == typeof n.then
        );
      }
      const Gu = (n) => {
        if (n && "function" == typeof n[bo])
          return ((n) => (t) => {
            const e = n[bo]();
            if ("function" != typeof e.subscribe)
              throw new TypeError(
                "Provided object does not correctly implement Symbol.observable"
              );
            return e.subscribe(t);
          })(n);
        if (Pp(n)) return Op(n);
        if (Lp(n))
          return ((n) => (t) => (
            n
              .then(
                (e) => {
                  t.closed || (t.next(e), t.complete());
                },
                (e) => t.error(e)
              )
              .then(null, rr),
            t
          ))(n);
        if (n && "function" == typeof n[ra])
          return ((n) => (t) => {
            const e = n[ra]();
            for (;;) {
              let r;
              try {
                r = e.next();
              } catch (i) {
                return t.error(i), t;
              }
              if (r.done) {
                t.complete();
                break;
              }
              if ((t.next(r.value), t.closed)) break;
            }
            return (
              "function" == typeof e.return &&
                t.add(() => {
                  e.return && e.return();
                }),
              t
            );
          })(n);
        {
          const e = `You provided ${
            zu(n) ? "an invalid object" : `'${n}'`
          } where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.`;
          throw new TypeError(e);
        }
      };
      function qu(n, t) {
        return new we((e) => {
          const r = new Se();
          let i = 0;
          return (
            r.add(
              t.schedule(function () {
                i !== n.length
                  ? (e.next(n[i++]), e.closed || r.add(this.schedule()))
                  : e.complete();
              })
            ),
            r
          );
        });
      }
      function Ue(n, t) {
        return t
          ? (function oS(n, t) {
              if (null != n) {
                if (
                  (function rS(n) {
                    return n && "function" == typeof n[bo];
                  })(n)
                )
                  return (function eS(n, t) {
                    return new we((e) => {
                      const r = new Se();
                      return (
                        r.add(
                          t.schedule(() => {
                            const i = n[bo]();
                            r.add(
                              i.subscribe({
                                next(o) {
                                  r.add(t.schedule(() => e.next(o)));
                                },
                                error(o) {
                                  r.add(t.schedule(() => e.error(o)));
                                },
                                complete() {
                                  r.add(t.schedule(() => e.complete()));
                                },
                              })
                            );
                          })
                        ),
                        r
                      );
                    });
                  })(n, t);
                if (Lp(n))
                  return (function tS(n, t) {
                    return new we((e) => {
                      const r = new Se();
                      return (
                        r.add(
                          t.schedule(() =>
                            n.then(
                              (i) => {
                                r.add(
                                  t.schedule(() => {
                                    e.next(i),
                                      r.add(t.schedule(() => e.complete()));
                                  })
                                );
                              },
                              (i) => {
                                r.add(t.schedule(() => e.error(i)));
                              }
                            )
                          )
                        ),
                        r
                      );
                    });
                  })(n, t);
                if (Pp(n)) return qu(n, t);
                if (
                  (function iS(n) {
                    return n && "function" == typeof n[ra];
                  })(n) ||
                  "string" == typeof n
                )
                  return (function nS(n, t) {
                    if (!n) throw new Error("Iterable cannot be null");
                    return new we((e) => {
                      const r = new Se();
                      let i;
                      return (
                        r.add(() => {
                          i && "function" == typeof i.return && i.return();
                        }),
                        r.add(
                          t.schedule(() => {
                            (i = n[ra]()),
                              r.add(
                                t.schedule(function () {
                                  if (e.closed) return;
                                  let o, s;
                                  try {
                                    const a = i.next();
                                    (o = a.value), (s = a.done);
                                  } catch (a) {
                                    return void e.error(a);
                                  }
                                  s
                                    ? e.complete()
                                    : (e.next(o), this.schedule());
                                })
                              );
                          })
                        ),
                        r
                      );
                    });
                  })(n, t);
              }
              throw new TypeError(
                ((null !== n && typeof n) || n) + " is not observable"
              );
            })(n, t)
          : n instanceof we
          ? n
          : new we(Gu(n));
      }
      class Co extends ye {
        constructor(t) {
          super(), (this.parent = t);
        }
        _next(t) {
          this.parent.notifyNext(t);
        }
        _error(t) {
          this.parent.notifyError(t), this.unsubscribe();
        }
        _complete() {
          this.parent.notifyComplete(), this.unsubscribe();
        }
      }
      class Do extends ye {
        notifyNext(t) {
          this.destination.next(t);
        }
        notifyError(t) {
          this.destination.error(t);
        }
        notifyComplete() {
          this.destination.complete();
        }
      }
      function Eo(n, t) {
        if (t.closed) return;
        if (n instanceof we) return n.subscribe(t);
        let e;
        try {
          e = Gu(n)(t);
        } catch (r) {
          t.error(r);
        }
        return e;
      }
      function et(n, t, e = Number.POSITIVE_INFINITY) {
        return "function" == typeof t
          ? (r) =>
              r.pipe(
                et((i, o) => Ue(n(i, o)).pipe(B((s, a) => t(i, s, o, a))), e)
              )
          : ("number" == typeof t && (e = t), (r) => r.lift(new sS(n, e)));
      }
      class sS {
        constructor(t, e = Number.POSITIVE_INFINITY) {
          (this.project = t), (this.concurrent = e);
        }
        call(t, e) {
          return e.subscribe(new aS(t, this.project, this.concurrent));
        }
      }
      class aS extends Do {
        constructor(t, e, r = Number.POSITIVE_INFINITY) {
          super(t),
            (this.project = e),
            (this.concurrent = r),
            (this.hasCompleted = !1),
            (this.buffer = []),
            (this.active = 0),
            (this.index = 0);
        }
        _next(t) {
          this.active < this.concurrent
            ? this._tryNext(t)
            : this.buffer.push(t);
        }
        _tryNext(t) {
          let e;
          const r = this.index++;
          try {
            e = this.project(t, r);
          } catch (i) {
            return void this.destination.error(i);
          }
          this.active++, this._innerSub(e);
        }
        _innerSub(t) {
          const e = new Co(this),
            r = this.destination;
          r.add(e);
          const i = Eo(t, e);
          i !== e && r.add(i);
        }
        _complete() {
          (this.hasCompleted = !0),
            0 === this.active &&
              0 === this.buffer.length &&
              this.destination.complete(),
            this.unsubscribe();
        }
        notifyNext(t) {
          this.destination.next(t);
        }
        notifyComplete() {
          const t = this.buffer;
          this.active--,
            t.length > 0
              ? this._next(t.shift())
              : 0 === this.active &&
                this.hasCompleted &&
                this.destination.complete();
        }
      }
      function ui(n = Number.POSITIVE_INFINITY) {
        return et(na, n);
      }
      function Wu(n, t) {
        return t ? qu(n, t) : new we(Op(n));
      }
      function Vp(...n) {
        let t = Number.POSITIVE_INFINITY,
          e = null,
          r = n[n.length - 1];
        return (
          li(r)
            ? ((e = n.pop()),
              n.length > 1 &&
                "number" == typeof n[n.length - 1] &&
                (t = n.pop()))
            : "number" == typeof r && (t = n.pop()),
          null === e && 1 === n.length && n[0] instanceof we
            ? n[0]
            : ui(t)(Wu(n, e))
        );
      }
      function ia() {
        return function (t) {
          return t.lift(new lS(t));
        };
      }
      class lS {
        constructor(t) {
          this.connectable = t;
        }
        call(t, e) {
          const { connectable: r } = this;
          r._refCount++;
          const i = new uS(t, r),
            o = e.subscribe(i);
          return i.closed || (i.connection = r.connect()), o;
        }
      }
      class uS extends ye {
        constructor(t, e) {
          super(t), (this.connectable = e);
        }
        _unsubscribe() {
          const { connectable: t } = this;
          if (!t) return void (this.connection = null);
          this.connectable = null;
          const e = t._refCount;
          if (e <= 0) return void (this.connection = null);
          if (((t._refCount = e - 1), e > 1))
            return void (this.connection = null);
          const { connection: r } = this,
            i = t._connection;
          (this.connection = null), i && (!r || i === r) && i.unsubscribe();
        }
      }
      class Ku extends we {
        constructor(t, e) {
          super(),
            (this.source = t),
            (this.subjectFactory = e),
            (this._refCount = 0),
            (this._isComplete = !1);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        connect() {
          let t = this._connection;
          return (
            t ||
              ((this._isComplete = !1),
              (t = this._connection = new Se()),
              t.add(this.source.subscribe(new dS(this.getSubject(), this))),
              t.closed && ((this._connection = null), (t = Se.EMPTY))),
            t
          );
        }
        refCount() {
          return ia()(this);
        }
      }
      const cS = (() => {
        const n = Ku.prototype;
        return {
          operator: { value: null },
          _refCount: { value: 0, writable: !0 },
          _subject: { value: null, writable: !0 },
          _connection: { value: null, writable: !0 },
          _subscribe: { value: n._subscribe },
          _isComplete: { value: n._isComplete, writable: !0 },
          getSubject: { value: n.getSubject },
          connect: { value: n.connect },
          refCount: { value: n.refCount },
        };
      })();
      class dS extends Np {
        constructor(t, e) {
          super(t), (this.connectable = e);
        }
        _error(t) {
          this._unsubscribe(), super._error(t);
        }
        _complete() {
          (this.connectable._isComplete = !0),
            this._unsubscribe(),
            super._complete();
        }
        _unsubscribe() {
          const t = this.connectable;
          if (t) {
            this.connectable = null;
            const e = t._connection;
            (t._refCount = 0),
              (t._subject = null),
              (t._connection = null),
              e && e.unsubscribe();
          }
        }
      }
      class pS {
        constructor(t, e) {
          (this.subjectFactory = t), (this.selector = e);
        }
        call(t, e) {
          const { selector: r } = this,
            i = this.subjectFactory(),
            o = r(i).subscribe(t);
          return o.add(e.subscribe(i)), o;
        }
      }
      function mS() {
        return new He();
      }
      function ve(n) {
        for (let t in n) if (n[t] === ve) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function Qu(n, t) {
        for (const e in t)
          t.hasOwnProperty(e) && !n.hasOwnProperty(e) && (n[e] = t[e]);
      }
      function be(n) {
        if ("string" == typeof n) return n;
        if (Array.isArray(n)) return "[" + n.map(be).join(", ") + "]";
        if (null == n) return "" + n;
        if (n.overriddenName) return `${n.overriddenName}`;
        if (n.name) return `${n.name}`;
        const t = n.toString();
        if (null == t) return "" + t;
        const e = t.indexOf("\n");
        return -1 === e ? t : t.substring(0, e);
      }
      function Yu(n, t) {
        return null == n || "" === n
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? n
          : n + " " + t;
      }
      const gS = ve({ __forward_ref__: ve });
      function Ce(n) {
        return (
          (n.__forward_ref__ = Ce),
          (n.toString = function () {
            return be(this());
          }),
          n
        );
      }
      function O(n) {
        return Zu(n) ? n() : n;
      }
      function Zu(n) {
        return (
          "function" == typeof n &&
          n.hasOwnProperty(gS) &&
          n.__forward_ref__ === Ce
        );
      }
      function Xu(n) {
        return n && !!n.ɵproviders;
      }
      class b extends Error {
        constructor(t, e) {
          super(
            (function sa(n, t) {
              return `NG0${Math.abs(n)}${t ? ": " + t.trim() : ""}`;
            })(t, e)
          ),
            (this.code = t);
        }
      }
      function H(n) {
        return "string" == typeof n ? n : null == n ? "" : String(n);
      }
      function aa(n, t) {
        throw new b(-201, !1);
      }
      function Ht(n, t) {
        null == n &&
          (function ce(n, t, e, r) {
            throw new Error(
              `ASSERTION ERROR: ${n}` +
                (null == r ? "" : ` [Expected=> ${e} ${r} ${t} <=Actual]`)
            );
          })(t, n, null, "!=");
      }
      function I(n) {
        return {
          token: n.token,
          providedIn: n.providedIn || null,
          factory: n.factory,
          value: void 0,
        };
      }
      function de(n) {
        return { providers: n.providers || [], imports: n.imports || [] };
      }
      function la(n) {
        return Hp(n, ua) || Hp(n, jp);
      }
      function Hp(n, t) {
        return n.hasOwnProperty(t) ? n[t] : null;
      }
      function Up(n) {
        return n && (n.hasOwnProperty(Ju) || n.hasOwnProperty(MS))
          ? n[Ju]
          : null;
      }
      const ua = ve({ ɵprov: ve }),
        Ju = ve({ ɵinj: ve }),
        jp = ve({ ngInjectableDef: ve }),
        MS = ve({ ngInjectorDef: ve });
      var P = (() => (
        ((P = P || {})[(P.Default = 0)] = "Default"),
        (P[(P.Host = 1)] = "Host"),
        (P[(P.Self = 2)] = "Self"),
        (P[(P.SkipSelf = 4)] = "SkipSelf"),
        (P[(P.Optional = 8)] = "Optional"),
        P
      ))();
      let ec;
      function Ut(n) {
        const t = ec;
        return (ec = n), t;
      }
      function $p(n, t, e) {
        const r = la(n);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : e & P.Optional
          ? null
          : void 0 !== t
          ? t
          : void aa(be(n));
      }
      const De = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        wo = {},
        tc = "__NG_DI_FLAG__",
        ca = "ngTempTokenPath",
        IS = /\n/gm,
        zp = "__source";
      let Mo;
      function ci(n) {
        const t = Mo;
        return (Mo = n), t;
      }
      function FS(n, t = P.Default) {
        if (void 0 === Mo) throw new b(-203, !1);
        return null === Mo
          ? $p(n, void 0, t)
          : Mo.get(n, t & P.Optional ? null : void 0, t);
      }
      function v(n, t = P.Default) {
        return (
          (function SS() {
            return ec;
          })() || FS
        )(O(n), t);
      }
      function Y(n, t = P.Default) {
        return v(n, da(t));
      }
      function da(n) {
        return typeof n > "u" || "number" == typeof n
          ? n
          : 0 |
              (n.optional && 8) |
              (n.host && 1) |
              (n.self && 2) |
              (n.skipSelf && 4);
      }
      function nc(n) {
        const t = [];
        for (let e = 0; e < n.length; e++) {
          const r = O(n[e]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new b(900, !1);
            let i,
              o = P.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = xS(a);
              "number" == typeof l
                ? -1 === l
                  ? (i = a.token)
                  : (o |= l)
                : (i = a);
            }
            t.push(v(i, o));
          } else t.push(v(r));
        }
        return t;
      }
      function So(n, t) {
        return (n[tc] = t), (n.prototype[tc] = t), n;
      }
      function xS(n) {
        return n[tc];
      }
      function or(n) {
        return { toString: n }.toString();
      }
      var en = (() => (
          ((en = en || {})[(en.OnPush = 0)] = "OnPush"),
          (en[(en.Default = 1)] = "Default"),
          en
        ))(),
        tn = (() => (
          (function (n) {
            (n[(n.Emulated = 0)] = "Emulated"),
              (n[(n.None = 2)] = "None"),
              (n[(n.ShadowDom = 3)] = "ShadowDom");
          })(tn || (tn = {})),
          tn
        ))();
      const Nn = {},
        ae = [],
        ha = ve({ ɵcmp: ve }),
        rc = ve({ ɵdir: ve }),
        ic = ve({ ɵpipe: ve }),
        qp = ve({ ɵmod: ve }),
        kn = ve({ ɵfac: ve }),
        Ao = ve({ __NG_ELEMENT_ID__: ve });
      let kS = 0;
      function Qe(n) {
        return or(() => {
          const e = !0 === n.standalone,
            r = {},
            i = {
              type: n.type,
              providersResolver: null,
              decls: n.decls,
              vars: n.vars,
              factory: null,
              template: n.template || null,
              consts: n.consts || null,
              ngContentSelectors: n.ngContentSelectors,
              hostBindings: n.hostBindings || null,
              hostVars: n.hostVars || 0,
              hostAttrs: n.hostAttrs || null,
              contentQueries: n.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: n.exportAs || null,
              onPush: n.changeDetection === en.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: e,
              dependencies: (e && n.dependencies) || null,
              getStandaloneInjector: null,
              selectors: n.selectors || ae,
              viewQuery: n.viewQuery || null,
              features: n.features || null,
              data: n.data || {},
              encapsulation: n.encapsulation || tn.Emulated,
              id: "c" + kS++,
              styles: n.styles || ae,
              _: null,
              setInput: null,
              schemas: n.schemas || null,
              tView: null,
              findHostDirectiveDefs: null,
              hostDirectives: null,
            },
            o = n.dependencies,
            s = n.features;
          return (
            (i.inputs = Qp(n.inputs, r)),
            (i.outputs = Qp(n.outputs)),
            s && s.forEach((a) => a(i)),
            (i.directiveDefs = o
              ? () => ("function" == typeof o ? o() : o).map(Wp).filter(Kp)
              : null),
            (i.pipeDefs = o
              ? () => ("function" == typeof o ? o() : o).map(dt).filter(Kp)
              : null),
            i
          );
        });
      }
      function Wp(n) {
        return he(n) || tt(n);
      }
      function Kp(n) {
        return null !== n;
      }
      function me(n) {
        return or(() => ({
          type: n.type,
          bootstrap: n.bootstrap || ae,
          declarations: n.declarations || ae,
          imports: n.imports || ae,
          exports: n.exports || ae,
          transitiveCompileScopes: null,
          schemas: n.schemas || null,
          id: n.id || null,
        }));
      }
      function Qp(n, t) {
        if (null == n) return Nn;
        const e = {};
        for (const r in n)
          if (n.hasOwnProperty(r)) {
            let i = n[r],
              o = i;
            Array.isArray(i) && ((o = i[1]), (i = i[0])),
              (e[i] = r),
              t && (t[i] = o);
          }
        return e;
      }
      const M = Qe;
      function Ct(n) {
        return {
          type: n.type,
          name: n.name,
          factory: null,
          pure: !1 !== n.pure,
          standalone: !0 === n.standalone,
          onDestroy: n.type.prototype.ngOnDestroy || null,
        };
      }
      function he(n) {
        return n[ha] || null;
      }
      function tt(n) {
        return n[rc] || null;
      }
      function dt(n) {
        return n[ic] || null;
      }
      function At(n, t) {
        const e = n[qp] || null;
        if (!e && !0 === t)
          throw new Error(`Type ${be(n)} does not have '\u0275mod' property.`);
        return e;
      }
      const G = 11;
      function It(n) {
        return Array.isArray(n) && "object" == typeof n[1];
      }
      function rn(n) {
        return Array.isArray(n) && !0 === n[1];
      }
      function ac(n) {
        return 0 != (4 & n.flags);
      }
      function xo(n) {
        return n.componentOffset > -1;
      }
      function ya(n) {
        return 1 == (1 & n.flags);
      }
      function on(n) {
        return null !== n.template;
      }
      function LS(n) {
        return 0 != (256 & n[2]);
      }
      function Tr(n, t) {
        return n.hasOwnProperty(kn) ? n[kn] : null;
      }
      class HS {
        constructor(t, e, r) {
          (this.previousValue = t),
            (this.currentValue = e),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Dt() {
        return tm;
      }
      function tm(n) {
        return n.type.prototype.ngOnChanges && (n.setInput = jS), US;
      }
      function US() {
        const n = rm(this),
          t = n?.current;
        if (t) {
          const e = n.previous;
          if (e === Nn) n.previous = t;
          else for (let r in t) e[r] = t[r];
          (n.current = null), this.ngOnChanges(t);
        }
      }
      function jS(n, t, e, r) {
        const i = this.declaredInputs[e],
          o =
            rm(n) ||
            (function $S(n, t) {
              return (n[nm] = t);
            })(n, { previous: Nn, current: null }),
          s = o.current || (o.current = {}),
          a = o.previous,
          l = a[i];
        (s[i] = new HS(l && l.currentValue, t, a === Nn)), (n[r] = t);
      }
      Dt.ngInherit = !0;
      const nm = "__ngSimpleChanges__";
      function rm(n) {
        return n[nm] || null;
      }
      function Ye(n) {
        for (; Array.isArray(n); ) n = n[0];
        return n;
      }
      function _a(n, t) {
        return Ye(t[n]);
      }
      function Tt(n, t) {
        return Ye(t[n.index]);
      }
      function sm(n, t) {
        return n.data[t];
      }
      function Ft(n, t) {
        const e = t[n];
        return It(e) ? e : e[0];
      }
      function va(n) {
        return 64 == (64 & n[2]);
      }
      function sr(n, t) {
        return null == t ? null : n[t];
      }
      function am(n) {
        n[18] = 0;
      }
      function uc(n, t) {
        n[5] += t;
        let e = n,
          r = n[3];
        for (
          ;
          null !== r && ((1 === t && 1 === e[5]) || (-1 === t && 0 === e[5]));

        )
          (r[5] += t), (e = r), (r = r[3]);
      }
      const U = { lFrame: vm(null), bindingsEnabled: !0 };
      function um() {
        return U.bindingsEnabled;
      }
      function C() {
        return U.lFrame.lView;
      }
      function ee() {
        return U.lFrame.tView;
      }
      function Ze() {
        let n = hm();
        for (; null !== n && 64 === n.type; ) n = n.parent;
        return n;
      }
      function hm() {
        return U.lFrame.currentTNode;
      }
      function _n(n, t) {
        const e = U.lFrame;
        (e.currentTNode = n), (e.isParent = t);
      }
      function cc() {
        return U.lFrame.isParent;
      }
      function dc() {
        U.lFrame.isParent = !1;
      }
      function yi() {
        return U.lFrame.bindingIndex++;
      }
      function nA(n, t) {
        const e = U.lFrame;
        (e.bindingIndex = e.bindingRootIndex = n), hc(t);
      }
      function hc(n) {
        U.lFrame.currentDirectiveIndex = n;
      }
      function gm() {
        return U.lFrame.currentQueryIndex;
      }
      function pc(n) {
        U.lFrame.currentQueryIndex = n;
      }
      function iA(n) {
        const t = n[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? n[6] : null;
      }
      function ym(n, t, e) {
        if (e & P.SkipSelf) {
          let i = t,
            o = n;
          for (
            ;
            !((i = i.parent),
            null !== i ||
              e & P.Host ||
              ((i = iA(o)), null === i || ((o = o[15]), 10 & i.type)));

          );
          if (null === i) return !1;
          (t = i), (n = o);
        }
        const r = (U.lFrame = _m());
        return (r.currentTNode = t), (r.lView = n), !0;
      }
      function mc(n) {
        const t = _m(),
          e = n[1];
        (U.lFrame = t),
          (t.currentTNode = e.firstChild),
          (t.lView = n),
          (t.tView = e),
          (t.contextLView = n),
          (t.bindingIndex = e.bindingStartIndex),
          (t.inI18n = !1);
      }
      function _m() {
        const n = U.lFrame,
          t = null === n ? null : n.child;
        return null === t ? vm(n) : t;
      }
      function vm(n) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: n,
          child: null,
          inI18n: !1,
        };
        return null !== n && (n.child = t), t;
      }
      function bm() {
        const n = U.lFrame;
        return (
          (U.lFrame = n.parent), (n.currentTNode = null), (n.lView = null), n
        );
      }
      const Cm = bm;
      function gc() {
        const n = bm();
        (n.isParent = !0),
          (n.tView = null),
          (n.selectedIndex = -1),
          (n.contextLView = null),
          (n.elementDepthCount = 0),
          (n.currentDirectiveIndex = -1),
          (n.currentNamespace = null),
          (n.bindingRootIndex = -1),
          (n.bindingIndex = -1),
          (n.currentQueryIndex = 0);
      }
      function pt() {
        return U.lFrame.selectedIndex;
      }
      function Fr(n) {
        U.lFrame.selectedIndex = n;
      }
      function Ae() {
        const n = U.lFrame;
        return sm(n.tView, n.selectedIndex);
      }
      function ba(n, t) {
        for (let e = t.directiveStart, r = t.directiveEnd; e < r; e++) {
          const o = n.data[e].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = o;
          s && (n.contentHooks || (n.contentHooks = [])).push(-e, s),
            a &&
              ((n.contentHooks || (n.contentHooks = [])).push(e, a),
              (n.contentCheckHooks || (n.contentCheckHooks = [])).push(e, a)),
            l && (n.viewHooks || (n.viewHooks = [])).push(-e, l),
            u &&
              ((n.viewHooks || (n.viewHooks = [])).push(e, u),
              (n.viewCheckHooks || (n.viewCheckHooks = [])).push(e, u)),
            null != c && (n.destroyHooks || (n.destroyHooks = [])).push(e, c);
        }
      }
      function Ca(n, t, e) {
        Dm(n, t, 3, e);
      }
      function Da(n, t, e, r) {
        (3 & n[2]) === e && Dm(n, t, e, r);
      }
      function yc(n, t) {
        let e = n[2];
        (3 & e) === t && ((e &= 2047), (e += 1), (n[2] = e));
      }
      function Dm(n, t, e, r) {
        const o = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & n[18] : 0; l < s; l++)
          if ("number" == typeof t[l + 1]) {
            if (((a = t[l]), null != r && a >= r)) break;
          } else
            t[l] < 0 && (n[18] += 65536),
              (a < o || -1 == o) &&
                (fA(n, e, t, l), (n[18] = (4294901760 & n[18]) + l + 2)),
              l++;
      }
      function fA(n, t, e, r) {
        const i = e[r] < 0,
          o = e[r + 1],
          a = n[i ? -e[r] : e[r]];
        if (i) {
          if (n[2] >> 11 < n[18] >> 16 && (3 & n[2]) === t) {
            n[2] += 2048;
            try {
              o.call(a);
            } finally {
            }
          }
        } else
          try {
            o.call(a);
          } finally {
          }
      }
      class No {
        constructor(t, e, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = e),
            (this.injectImpl = r);
        }
      }
      function vc(n, t, e) {
        let r = 0;
        for (; r < e.length; ) {
          const i = e[r];
          if ("number" == typeof i) {
            if (0 !== i) break;
            r++;
            const o = e[r++],
              s = e[r++],
              a = e[r++];
            n.setAttribute(t, s, a, o);
          } else {
            const o = i,
              s = e[++r];
            wm(o) ? n.setProperty(t, o, s) : n.setAttribute(t, o, s), r++;
          }
        }
        return r;
      }
      function Em(n) {
        return 3 === n || 4 === n || 6 === n;
      }
      function wm(n) {
        return 64 === n.charCodeAt(0);
      }
      function ko(n, t) {
        if (null !== t && 0 !== t.length)
          if (null === n || 0 === n.length) n = t.slice();
          else {
            let e = -1;
            for (let r = 0; r < t.length; r++) {
              const i = t[r];
              "number" == typeof i
                ? (e = i)
                : 0 === e ||
                  Mm(n, e, i, null, -1 === e || 2 === e ? t[++r] : null);
            }
          }
        return n;
      }
      function Mm(n, t, e, r, i) {
        let o = 0,
          s = n.length;
        if (-1 === t) s = -1;
        else
          for (; o < n.length; ) {
            const a = n[o++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = o - 1;
                break;
              }
            }
          }
        for (; o < n.length; ) {
          const a = n[o];
          if ("number" == typeof a) break;
          if (a === e) {
            if (null === r) return void (null !== i && (n[o + 1] = i));
            if (r === n[o + 1]) return void (n[o + 2] = i);
          }
          o++, null !== r && o++, null !== i && o++;
        }
        -1 !== s && (n.splice(s, 0, t), (o = s + 1)),
          n.splice(o++, 0, e),
          null !== r && n.splice(o++, 0, r),
          null !== i && n.splice(o++, 0, i);
      }
      function Sm(n) {
        return -1 !== n;
      }
      function Ea(n) {
        return 32767 & n;
      }
      function wa(n, t) {
        let e = (function yA(n) {
            return n >> 16;
          })(n),
          r = t;
        for (; e > 0; ) (r = r[15]), e--;
        return r;
      }
      let bc = !0;
      function Ma(n) {
        const t = bc;
        return (bc = n), t;
      }
      let _A = 0;
      const vn = {};
      function Sa(n, t) {
        const e = Tm(n, t);
        if (-1 !== e) return e;
        const r = t[1];
        r.firstCreatePass &&
          ((n.injectorIndex = t.length),
          Cc(r.data, n),
          Cc(t, null),
          Cc(r.blueprint, null));
        const i = Dc(n, t),
          o = n.injectorIndex;
        if (Sm(i)) {
          const s = Ea(i),
            a = wa(i, t),
            l = a[1].data;
          for (let u = 0; u < 8; u++) t[o + u] = a[s + u] | l[s + u];
        }
        return (t[o + 8] = i), o;
      }
      function Cc(n, t) {
        n.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function Tm(n, t) {
        return -1 === n.injectorIndex ||
          (n.parent && n.parent.injectorIndex === n.injectorIndex) ||
          null === t[n.injectorIndex + 8]
          ? -1
          : n.injectorIndex;
      }
      function Dc(n, t) {
        if (n.parent && -1 !== n.parent.injectorIndex)
          return n.parent.injectorIndex;
        let e = 0,
          r = null,
          i = t;
        for (; null !== i; ) {
          if (((r = Pm(i)), null === r)) return -1;
          if ((e++, (i = i[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (e << 16);
        }
        return -1;
      }
      function Ec(n, t, e) {
        !(function vA(n, t, e) {
          let r;
          "string" == typeof e
            ? (r = e.charCodeAt(0) || 0)
            : e.hasOwnProperty(Ao) && (r = e[Ao]),
            null == r && (r = e[Ao] = _A++);
          const i = 255 & r;
          t.data[n + (i >> 5)] |= 1 << i;
        })(n, t, e);
      }
      function Fm(n, t, e) {
        if (e & P.Optional || void 0 !== n) return n;
        aa();
      }
      function xm(n, t, e, r) {
        if (
          (e & P.Optional && void 0 === r && (r = null),
          0 == (e & (P.Self | P.Host)))
        ) {
          const i = n[9],
            o = Ut(void 0);
          try {
            return i ? i.get(t, r, e & P.Optional) : $p(t, r, e & P.Optional);
          } finally {
            Ut(o);
          }
        }
        return Fm(r, 0, e);
      }
      function Rm(n, t, e, r = P.Default, i) {
        if (null !== n) {
          if (1024 & t[2]) {
            const s = (function wA(n, t, e, r, i) {
              let o = n,
                s = t;
              for (
                ;
                null !== o && null !== s && 1024 & s[2] && !(256 & s[2]);

              ) {
                const a = Nm(o, s, e, r | P.Self, vn);
                if (a !== vn) return a;
                let l = o.parent;
                if (!l) {
                  const u = s[21];
                  if (u) {
                    const c = u.get(e, vn, r);
                    if (c !== vn) return c;
                  }
                  (l = Pm(s)), (s = s[15]);
                }
                o = l;
              }
              return i;
            })(n, t, e, r, vn);
            if (s !== vn) return s;
          }
          const o = Nm(n, t, e, r, vn);
          if (o !== vn) return o;
        }
        return xm(t, e, r, i);
      }
      function Nm(n, t, e, r, i) {
        const o = (function DA(n) {
          if ("string" == typeof n) return n.charCodeAt(0) || 0;
          const t = n.hasOwnProperty(Ao) ? n[Ao] : void 0;
          return "number" == typeof t ? (t >= 0 ? 255 & t : EA) : t;
        })(e);
        if ("function" == typeof o) {
          if (!ym(t, n, r)) return r & P.Host ? Fm(i, 0, r) : xm(t, e, r, i);
          try {
            const s = o(r);
            if (null != s || r & P.Optional) return s;
            aa();
          } finally {
            Cm();
          }
        } else if ("number" == typeof o) {
          let s = null,
            a = Tm(n, t),
            l = -1,
            u = r & P.Host ? t[16][6] : null;
          for (
            (-1 === a || r & P.SkipSelf) &&
            ((l = -1 === a ? Dc(n, t) : t[a + 8]),
            -1 !== l && Om(r, !1)
              ? ((s = t[1]), (a = Ea(l)), (t = wa(l, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[1];
            if (km(o, a, c.data)) {
              const d = CA(a, t, e, s, r, u);
              if (d !== vn) return d;
            }
            (l = t[a + 8]),
              -1 !== l && Om(r, t[1].data[a + 8] === u) && km(o, a, t)
                ? ((s = c), (a = Ea(l)), (t = wa(l, t)))
                : (a = -1);
          }
        }
        return i;
      }
      function CA(n, t, e, r, i, o) {
        const s = t[1],
          a = s.data[n + 8],
          c = Aa(
            a,
            s,
            e,
            null == r ? xo(a) && bc : r != s && 0 != (3 & a.type),
            i & P.Host && o === a
          );
        return null !== c ? xr(t, s, c, a) : vn;
      }
      function Aa(n, t, e, r, i) {
        const o = n.providerIndexes,
          s = t.data,
          a = 1048575 & o,
          l = n.directiveStart,
          c = o >> 20,
          h = i ? a + c : n.directiveEnd;
        for (let f = r ? a : a + c; f < h; f++) {
          const p = s[f];
          if ((f < l && e === p) || (f >= l && p.type === e)) return f;
        }
        if (i) {
          const f = s[l];
          if (f && on(f) && f.type === e) return l;
        }
        return null;
      }
      function xr(n, t, e, r) {
        let i = n[e];
        const o = t.data;
        if (
          (function pA(n) {
            return n instanceof No;
          })(i)
        ) {
          const s = i;
          s.resolving &&
            (function yS(n, t) {
              const e = t ? `. Dependency path: ${t.join(" > ")} > ${n}` : "";
              throw new b(
                -200,
                `Circular dependency in DI detected for ${n}${e}`
              );
            })(
              (function ue(n) {
                return "function" == typeof n
                  ? n.name || n.toString()
                  : "object" == typeof n &&
                    null != n &&
                    "function" == typeof n.type
                  ? n.type.name || n.type.toString()
                  : H(n);
              })(o[e])
            );
          const a = Ma(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? Ut(s.injectImpl) : null;
          ym(n, r, P.Default);
          try {
            (i = n[e] = s.factory(void 0, o, n, r)),
              t.firstCreatePass &&
                e >= r.directiveStart &&
                (function hA(n, t, e) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: i,
                    ngDoCheck: o,
                  } = t.type.prototype;
                  if (r) {
                    const s = tm(t);
                    (e.preOrderHooks || (e.preOrderHooks = [])).push(n, s),
                      (
                        e.preOrderCheckHooks || (e.preOrderCheckHooks = [])
                      ).push(n, s);
                  }
                  i &&
                    (e.preOrderHooks || (e.preOrderHooks = [])).push(0 - n, i),
                    o &&
                      ((e.preOrderHooks || (e.preOrderHooks = [])).push(n, o),
                      (
                        e.preOrderCheckHooks || (e.preOrderCheckHooks = [])
                      ).push(n, o));
                })(e, o[e], t);
          } finally {
            null !== l && Ut(l), Ma(a), (s.resolving = !1), Cm();
          }
        }
        return i;
      }
      function km(n, t, e) {
        return !!(e[t + (n >> 5)] & (1 << n));
      }
      function Om(n, t) {
        return !(n & P.Self || (n & P.Host && t));
      }
      class vi {
        constructor(t, e) {
          (this._tNode = t), (this._lView = e);
        }
        get(t, e, r) {
          return Rm(this._tNode, this._lView, t, da(r), e);
        }
      }
      function EA() {
        return new vi(Ze(), C());
      }
      function je(n) {
        return or(() => {
          const t = n.prototype.constructor,
            e = t[kn] || wc(t),
            r = Object.prototype;
          let i = Object.getPrototypeOf(n.prototype).constructor;
          for (; i && i !== r; ) {
            const o = i[kn] || wc(i);
            if (o && o !== e) return o;
            i = Object.getPrototypeOf(i);
          }
          return (o) => new o();
        });
      }
      function wc(n) {
        return Zu(n)
          ? () => {
              const t = wc(O(n));
              return t && t();
            }
          : Tr(n);
      }
      function Pm(n) {
        const t = n[1],
          e = t.type;
        return 2 === e ? t.declTNode : 1 === e ? n[6] : null;
      }
      const Di = "__parameters__";
      function wi(n, t, e) {
        return or(() => {
          const r = (function Mc(n) {
            return function (...e) {
              if (n) {
                const r = n(...e);
                for (const i in r) this[i] = r[i];
              }
            };
          })(t);
          function i(...o) {
            if (this instanceof i) return r.apply(this, o), this;
            const s = new i(...o);
            return (a.annotation = s), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(Di)
                ? l[Di]
                : Object.defineProperty(l, Di, { value: [] })[Di];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), l;
            }
          }
          return (
            e && (i.prototype = Object.create(e.prototype)),
            (i.prototype.ngMetadataName = n),
            (i.annotationCls = i),
            i
          );
        });
      }
      class w {
        constructor(t, e) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof e
              ? (this.__NG_ELEMENT_ID__ = e)
              : void 0 !== e &&
                (this.ɵprov = I({
                  token: this,
                  providedIn: e.providedIn || "root",
                  factory: e.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function Rr(n, t) {
        n.forEach((e) => (Array.isArray(e) ? Rr(e, t) : t(e)));
      }
      function Vm(n, t, e) {
        t >= n.length ? n.push(e) : n.splice(t, 0, e);
      }
      function Ia(n, t) {
        return t >= n.length - 1 ? n.pop() : n.splice(t, 1)[0];
      }
      function Lo(n, t) {
        const e = [];
        for (let r = 0; r < n; r++) e.push(t);
        return e;
      }
      function xt(n, t, e) {
        let r = Mi(n, t);
        return (
          r >= 0
            ? (n[1 | r] = e)
            : ((r = ~r),
              (function IA(n, t, e, r) {
                let i = n.length;
                if (i == t) n.push(e, r);
                else if (1 === i) n.push(r, n[0]), (n[0] = e);
                else {
                  for (i--, n.push(n[i - 1], n[i]); i > t; )
                    (n[i] = n[i - 2]), i--;
                  (n[t] = e), (n[t + 1] = r);
                }
              })(n, r, t, e)),
          r
        );
      }
      function Ac(n, t) {
        const e = Mi(n, t);
        if (e >= 0) return n[1 | e];
      }
      function Mi(n, t) {
        return (function Bm(n, t, e) {
          let r = 0,
            i = n.length >> e;
          for (; i !== r; ) {
            const o = r + ((i - r) >> 1),
              s = n[o << e];
            if (t === s) return o << e;
            s > t ? (i = o) : (r = o + 1);
          }
          return ~(i << e);
        })(n, t, 1);
      }
      const ar = So(wi("Optional"), 8),
        Si = So(wi("SkipSelf"), 4);
      var Et = (() => (
        ((Et = Et || {})[(Et.Important = 1)] = "Important"),
        (Et[(Et.DashCase = 2)] = "DashCase"),
        Et
      ))();
      const Nc = new Map();
      let YA = 0;
      const Oc = "__ngContext__";
      function it(n, t) {
        It(t)
          ? ((n[Oc] = t[20]),
            (function XA(n) {
              Nc.set(n[20], n);
            })(t))
          : (n[Oc] = t);
      }
      function Lc(n, t) {
        return undefined(n, t);
      }
      function Uo(n) {
        const t = n[3];
        return rn(t) ? t[3] : t;
      }
      function Vc(n) {
        return og(n[13]);
      }
      function Bc(n) {
        return og(n[4]);
      }
      function og(n) {
        for (; null !== n && !rn(n); ) n = n[4];
        return n;
      }
      function Ii(n, t, e, r, i) {
        if (null != r) {
          let o,
            s = !1;
          rn(r) ? (o = r) : It(r) && ((s = !0), (r = r[0]));
          const a = Ye(r);
          0 === n && null !== e
            ? null == i
              ? dg(t, e, a)
              : Nr(t, e, a, i || null, !0)
            : 1 === n && null !== e
            ? Nr(t, e, a, i || null, !0)
            : 2 === n
            ? (function qc(n, t, e) {
                const r = Ra(n, t);
                r &&
                  (function v0(n, t, e, r) {
                    n.removeChild(t, e, r);
                  })(n, r, t, e);
              })(t, a, s)
            : 3 === n && t.destroyNode(a),
            null != o &&
              (function D0(n, t, e, r, i) {
                const o = e[7];
                o !== Ye(e) && Ii(t, n, r, o, i);
                for (let a = 10; a < e.length; a++) {
                  const l = e[a];
                  jo(l[1], l, n, t, r, o);
                }
              })(t, n, o, e, i);
        }
      }
      function Uc(n, t, e) {
        return n.createElement(t, e);
      }
      function ag(n, t) {
        const e = n[9],
          r = e.indexOf(t),
          i = t[3];
        512 & t[2] && ((t[2] &= -513), uc(i, -1)), e.splice(r, 1);
      }
      function jc(n, t) {
        if (n.length <= 10) return;
        const e = 10 + t,
          r = n[e];
        if (r) {
          const i = r[17];
          null !== i && i !== n && ag(i, r), t > 0 && (n[e - 1][4] = r[4]);
          const o = Ia(n, 10 + t);
          !(function d0(n, t) {
            jo(n, t, t[G], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const s = o[19];
          null !== s && s.detachView(o[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -65);
        }
        return r;
      }
      function lg(n, t) {
        if (!(128 & t[2])) {
          const e = t[G];
          e.destroyNode && jo(n, t, e, 3, null, null),
            (function p0(n) {
              let t = n[13];
              if (!t) return $c(n[1], n);
              for (; t; ) {
                let e = null;
                if (It(t)) e = t[13];
                else {
                  const r = t[10];
                  r && (e = r);
                }
                if (!e) {
                  for (; t && !t[4] && t !== n; )
                    It(t) && $c(t[1], t), (t = t[3]);
                  null === t && (t = n), It(t) && $c(t[1], t), (e = t && t[4]);
                }
                t = e;
              }
            })(t);
        }
      }
      function $c(n, t) {
        if (!(128 & t[2])) {
          (t[2] &= -65),
            (t[2] |= 128),
            (function _0(n, t) {
              let e;
              if (null != n && null != (e = n.destroyHooks))
                for (let r = 0; r < e.length; r += 2) {
                  const i = t[e[r]];
                  if (!(i instanceof No)) {
                    const o = e[r + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = i[o[s]],
                          l = o[s + 1];
                        try {
                          l.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        o.call(i);
                      } finally {
                      }
                  }
                }
            })(n, t),
            (function y0(n, t) {
              const e = n.cleanup,
                r = t[7];
              let i = -1;
              if (null !== e)
                for (let o = 0; o < e.length - 1; o += 2)
                  if ("string" == typeof e[o]) {
                    const s = e[o + 3];
                    s >= 0 ? r[(i = s)]() : r[(i = -s)].unsubscribe(), (o += 2);
                  } else {
                    const s = r[(i = e[o + 1])];
                    e[o].call(s);
                  }
              if (null !== r) {
                for (let o = i + 1; o < r.length; o++) (0, r[o])();
                t[7] = null;
              }
            })(n, t),
            1 === t[1].type && t[G].destroy();
          const e = t[17];
          if (null !== e && rn(t[3])) {
            e !== t[3] && ag(e, t);
            const r = t[19];
            null !== r && r.detachView(n);
          }
          !(function JA(n) {
            Nc.delete(n[20]);
          })(t);
        }
      }
      function ug(n, t, e) {
        return (function cg(n, t, e) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return e[0];
          {
            const { componentOffset: i } = r;
            if (i > -1) {
              const { encapsulation: o } = n.data[r.directiveStart + i];
              if (o === tn.None || o === tn.Emulated) return null;
            }
            return Tt(r, e);
          }
        })(n, t.parent, e);
      }
      function Nr(n, t, e, r, i) {
        n.insertBefore(t, e, r, i);
      }
      function dg(n, t, e) {
        n.appendChild(t, e);
      }
      function hg(n, t, e, r, i) {
        null !== r ? Nr(n, t, e, r, i) : dg(n, t, e);
      }
      function Ra(n, t) {
        return n.parentNode(t);
      }
      function fg(n, t, e) {
        return mg(n, t, e);
      }
      let Qc,
        mg = function pg(n, t, e) {
          return 40 & n.type ? Tt(n, e) : null;
        };
      function Na(n, t, e, r) {
        const i = ug(n, r, t),
          o = t[G],
          a = fg(r.parent || t[6], r, t);
        if (null != i)
          if (Array.isArray(e))
            for (let l = 0; l < e.length; l++) hg(o, i, e[l], a, !1);
          else hg(o, i, e, a, !1);
      }
      function ka(n, t) {
        if (null !== t) {
          const e = t.type;
          if (3 & e) return Tt(t, n);
          if (4 & e) return Gc(-1, n[t.index]);
          if (8 & e) {
            const r = t.child;
            if (null !== r) return ka(n, r);
            {
              const i = n[t.index];
              return rn(i) ? Gc(-1, i) : Ye(i);
            }
          }
          if (32 & e) return Lc(t, n)() || Ye(n[t.index]);
          {
            const r = yg(n, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : ka(Uo(n[16]), r)
              : ka(n, t.next);
          }
        }
        return null;
      }
      function yg(n, t) {
        return null !== t ? n[16][6].projection[t.projection] : null;
      }
      function Gc(n, t) {
        const e = 10 + n + 1;
        if (e < t.length) {
          const r = t[e],
            i = r[1].firstChild;
          if (null !== i) return ka(r, i);
        }
        return t[7];
      }
      function Wc(n, t, e, r, i, o, s) {
        for (; null != e; ) {
          const a = r[e.index],
            l = e.type;
          if (
            (s && 0 === t && (a && it(Ye(a), r), (e.flags |= 2)),
            32 != (32 & e.flags))
          )
            if (8 & l) Wc(n, t, e.child, r, i, o, !1), Ii(t, n, i, a, o);
            else if (32 & l) {
              const u = Lc(e, r);
              let c;
              for (; (c = u()); ) Ii(t, n, i, c, o);
              Ii(t, n, i, a, o);
            } else 16 & l ? _g(n, t, r, e, i, o) : Ii(t, n, i, a, o);
          e = s ? e.projectionNext : e.next;
        }
      }
      function jo(n, t, e, r, i, o) {
        Wc(e, r, n.firstChild, t, i, o, !1);
      }
      function _g(n, t, e, r, i, o) {
        const s = e[16],
          l = s[6].projection[r.projection];
        if (Array.isArray(l))
          for (let u = 0; u < l.length; u++) Ii(t, n, i, l[u], o);
        else Wc(n, t, l, s[3], i, o, !0);
      }
      function vg(n, t, e) {
        "" === e
          ? n.removeAttribute(t, "class")
          : n.setAttribute(t, "class", e);
      }
      function bg(n, t, e) {
        const { mergedAttrs: r, classes: i, styles: o } = e;
        null !== r && vc(n, t, r),
          null !== i && vg(n, t, i),
          null !== o &&
            (function w0(n, t, e) {
              n.setAttribute(t, "style", e);
            })(n, t, o);
      }
      class Or {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      const Ba = new w("ENVIRONMENT_INITIALIZER"),
        Og = new w("INJECTOR", -1),
        Pg = new w("INJECTOR_DEF_TYPES");
      class Lg {
        get(t, e = wo) {
          if (e === wo) {
            const r = new Error(`NullInjectorError: No provider for ${be(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return e;
        }
      }
      function tI(...n) {
        return { ɵproviders: Vg(0, n), ɵfromNgModule: !0 };
      }
      function Vg(n, ...t) {
        const e = [],
          r = new Set();
        let i;
        return (
          Rr(t, (o) => {
            const s = o;
            ed(s, e, [], r) && (i || (i = []), i.push(s));
          }),
          void 0 !== i && Bg(i, e),
          e
        );
      }
      function Bg(n, t) {
        for (let e = 0; e < n.length; e++) {
          const { providers: i } = n[e];
          td(i, (o) => {
            t.push(o);
          });
        }
      }
      function ed(n, t, e, r) {
        if (!(n = O(n))) return !1;
        let i = null,
          o = Up(n);
        const s = !o && he(n);
        if (o || s) {
          if (s && !s.standalone) return !1;
          i = n;
        } else {
          const l = n.ngModule;
          if (((o = Up(l)), !o)) return !1;
          i = l;
        }
        const a = r.has(i);
        if (s) {
          if (a) return !1;
          if ((r.add(i), s.dependencies)) {
            const l =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const u of l) ed(u, t, e, r);
          }
        } else {
          if (!o) return !1;
          {
            if (null != o.imports && !a) {
              let u;
              r.add(i);
              try {
                Rr(o.imports, (c) => {
                  ed(c, t, e, r) && (u || (u = []), u.push(c));
                });
              } finally {
              }
              void 0 !== u && Bg(u, t);
            }
            if (!a) {
              const u = Tr(i) || (() => new i());
              t.push(
                { provide: i, useFactory: u, deps: ae },
                { provide: Pg, useValue: i, multi: !0 },
                { provide: Ba, useValue: () => v(i), multi: !0 }
              );
            }
            const l = o.providers;
            null == l ||
              a ||
              td(l, (c) => {
                t.push(c);
              });
          }
        }
        return i !== n && void 0 !== n.providers;
      }
      function td(n, t) {
        for (let e of n)
          Xu(e) && (e = e.ɵproviders), Array.isArray(e) ? td(e, t) : t(e);
      }
      const nI = ve({ provide: String, useValue: ve });
      function nd(n) {
        return null !== n && "object" == typeof n && nI in n;
      }
      function Pr(n) {
        return "function" == typeof n;
      }
      const rd = new w("Set Injector scope."),
        Ha = {},
        iI = {};
      let id;
      function Ua() {
        return void 0 === id && (id = new Lg()), id;
      }
      class Bn {}
      class jg extends Bn {
        constructor(t, e, r, i) {
          super(),
            (this.parent = e),
            (this.source = r),
            (this.scopes = i),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            sd(t, (s) => this.processProvider(s)),
            this.records.set(Og, Ti(void 0, this)),
            i.has("environment") && this.records.set(Bn, Ti(void 0, this));
          const o = this.records.get(rd);
          null != o && "string" == typeof o.value && this.scopes.add(o.value),
            (this.injectorDefTypes = new Set(this.get(Pg.multi, ae, P.Self)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            for (const t of this._onDestroyHooks) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(t) {
          this._onDestroyHooks.push(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const e = ci(this),
            r = Ut(void 0);
          try {
            return t();
          } finally {
            ci(e), Ut(r);
          }
        }
        get(t, e = wo, r = P.Default) {
          this.assertNotDestroyed(), (r = da(r));
          const i = ci(this),
            o = Ut(void 0);
          try {
            if (!(r & P.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const l =
                  (function uI(n) {
                    return (
                      "function" == typeof n ||
                      ("object" == typeof n && n instanceof w)
                    );
                  })(t) && la(t);
                (a = l && this.injectableDefInScope(l) ? Ti(od(t), Ha) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & P.Self ? Ua() : this.parent).get(
              t,
              (e = r & P.Optional && e === wo ? null : e)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[ca] = s[ca] || []).unshift(be(t)), i)) throw s;
              return (function RS(n, t, e, r) {
                const i = n[ca];
                throw (
                  (t[zp] && i.unshift(t[zp]),
                  (n.message = (function NS(n, t, e, r = null) {
                    n =
                      n && "\n" === n.charAt(0) && "\u0275" == n.charAt(1)
                        ? n.slice(2)
                        : n;
                    let i = be(t);
                    if (Array.isArray(t)) i = t.map(be).join(" -> ");
                    else if ("object" == typeof t) {
                      let o = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          o.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : be(a))
                          );
                        }
                      i = `{${o.join(", ")}}`;
                    }
                    return `${e}${r ? "(" + r + ")" : ""}[${i}]: ${n.replace(
                      IS,
                      "\n  "
                    )}`;
                  })("\n" + n.message, i, e, r)),
                  (n.ngTokenPath = i),
                  (n[ca] = null),
                  n)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            Ut(o), ci(i);
          }
        }
        resolveInjectorInitializers() {
          const t = ci(this),
            e = Ut(void 0);
          try {
            const r = this.get(Ba.multi, ae, P.Self);
            for (const i of r) i();
          } finally {
            ci(t), Ut(e);
          }
        }
        toString() {
          const t = [],
            e = this.records;
          for (const r of e.keys()) t.push(be(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new b(205, !1);
        }
        processProvider(t) {
          let e = Pr((t = O(t))) ? t : O(t && t.provide);
          const r = (function sI(n) {
            return nd(n) ? Ti(void 0, n.useValue) : Ti($g(n), Ha);
          })(t);
          if (Pr(t) || !0 !== t.multi) this.records.get(e);
          else {
            let i = this.records.get(e);
            i ||
              ((i = Ti(void 0, Ha, !0)),
              (i.factory = () => nc(i.multi)),
              this.records.set(e, i)),
              (e = t),
              i.multi.push(t);
          }
          this.records.set(e, r);
        }
        hydrate(t, e) {
          return (
            e.value === Ha && ((e.value = iI), (e.value = e.factory())),
            "object" == typeof e.value &&
              e.value &&
              (function lI(n) {
                return (
                  null !== n &&
                  "object" == typeof n &&
                  "function" == typeof n.ngOnDestroy
                );
              })(e.value) &&
              this._ngOnDestroyHooks.add(e.value),
            e.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const e = O(t.providedIn);
          return "string" == typeof e
            ? "any" === e || this.scopes.has(e)
            : this.injectorDefTypes.has(e);
        }
      }
      function od(n) {
        const t = la(n),
          e = null !== t ? t.factory : Tr(n);
        if (null !== e) return e;
        if (n instanceof w) throw new b(204, !1);
        if (n instanceof Function)
          return (function oI(n) {
            const t = n.length;
            if (t > 0) throw (Lo(t, "?"), new b(204, !1));
            const e = (function ES(n) {
              const t = n && (n[ua] || n[jp]);
              if (t) {
                const e = (function wS(n) {
                  if (n.hasOwnProperty("name")) return n.name;
                  const t = ("" + n).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(n);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${e}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${e}" class.`
                  ),
                  t
                );
              }
              return null;
            })(n);
            return null !== e ? () => e.factory(n) : () => new n();
          })(n);
        throw new b(204, !1);
      }
      function $g(n, t, e) {
        let r;
        if (Pr(n)) {
          const i = O(n);
          return Tr(i) || od(i);
        }
        if (nd(n)) r = () => O(n.useValue);
        else if (
          (function Ug(n) {
            return !(!n || !n.useFactory);
          })(n)
        )
          r = () => n.useFactory(...nc(n.deps || []));
        else if (
          (function Hg(n) {
            return !(!n || !n.useExisting);
          })(n)
        )
          r = () => v(O(n.useExisting));
        else {
          const i = O(n && (n.useClass || n.provide));
          if (
            !(function aI(n) {
              return !!n.deps;
            })(n)
          )
            return Tr(i) || od(i);
          r = () => new i(...nc(n.deps));
        }
        return r;
      }
      function Ti(n, t, e = !1) {
        return { factory: n, value: t, multi: e ? [] : void 0 };
      }
      function sd(n, t) {
        for (const e of n)
          Array.isArray(e) ? sd(e, t) : e && Xu(e) ? sd(e.ɵproviders, t) : t(e);
      }
      class cI {}
      class zg {}
      class hI {
        resolveComponentFactory(t) {
          throw (function dI(n) {
            const t = Error(
              `No component factory found for ${be(
                n
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = n), t;
          })(t);
        }
      }
      let Go = (() => {
        class n {}
        return (n.NULL = new hI()), n;
      })();
      function fI() {
        return Fi(Ze(), C());
      }
      function Fi(n, t) {
        return new fe(Tt(n, t));
      }
      let fe = (() => {
        class n {
          constructor(e) {
            this.nativeElement = e;
          }
        }
        return (n.__NG_ELEMENT_ID__ = fI), n;
      })();
      function pI(n) {
        return n instanceof fe ? n.nativeElement : n;
      }
      class qo {}
      let Hn = (() => {
          class n {}
          return (
            (n.__NG_ELEMENT_ID__ = () =>
              (function mI() {
                const n = C(),
                  e = Ft(Ze().index, n);
                return (It(e) ? e : n)[G];
              })()),
            n
          );
        })(),
        gI = (() => {
          class n {}
          return (
            (n.ɵprov = I({
              token: n,
              providedIn: "root",
              factory: () => null,
            })),
            n
          );
        })();
      class lr {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const yI = new lr("15.0.4"),
        ad = {};
      function ud(n) {
        return n.ngOriginalError;
      }
      class Cn {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const e = this._findOriginalError(t);
          this._console.error("ERROR", t),
            e && this._console.error("ORIGINAL ERROR", e);
        }
        _findOriginalError(t) {
          let e = t && ud(t);
          for (; e && ud(e); ) e = ud(e);
          return e || null;
        }
      }
      function Un(n) {
        return n instanceof Function ? n() : n;
      }
      function Wg(n, t, e) {
        let r = n.length;
        for (;;) {
          const i = n.indexOf(t, e);
          if (-1 === i) return i;
          if (0 === i || n.charCodeAt(i - 1) <= 32) {
            const o = t.length;
            if (i + o === r || n.charCodeAt(i + o) <= 32) return i;
          }
          e = i + 1;
        }
      }
      const Kg = "ng-template";
      function II(n, t, e) {
        let r = 0;
        for (; r < n.length; ) {
          let i = n[r++];
          if (e && "class" === i) {
            if (((i = n[r]), -1 !== Wg(i.toLowerCase(), t, 0))) return !0;
          } else if (1 === i) {
            for (; r < n.length && "string" == typeof (i = n[r++]); )
              if (i.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function Qg(n) {
        return 4 === n.type && n.value !== Kg;
      }
      function TI(n, t, e) {
        return t === (4 !== n.type || e ? n.value : Kg);
      }
      function FI(n, t, e) {
        let r = 4;
        const i = n.attrs || [],
          o = (function NI(n) {
            for (let t = 0; t < n.length; t++) if (Em(n[t])) return t;
            return n.length;
          })(i);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !TI(n, l, e)) || ("" === l && 1 === t.length))
                ) {
                  if (sn(r)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & r ? l : t[++a];
                if (8 & r && null !== n.attrs) {
                  if (!II(n.attrs, u, e)) {
                    if (sn(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = xI(8 & r ? "class" : l, i, Qg(n), e);
                if (-1 === d) {
                  if (sn(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let h;
                  h = d > o ? "" : i[d + 1].toLowerCase();
                  const f = 8 & r ? h : null;
                  if ((f && -1 !== Wg(f, u, 0)) || (2 & r && u !== h)) {
                    if (sn(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !sn(r) && !sn(l)) return !1;
            if (s && sn(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return sn(r) || s;
      }
      function sn(n) {
        return 0 == (1 & n);
      }
      function xI(n, t, e, r) {
        if (null === t) return -1;
        let i = 0;
        if (r || !e) {
          let o = !1;
          for (; i < t.length; ) {
            const s = t[i];
            if (s === n) return i;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++i];
                for (; "string" == typeof a; ) a = t[++i];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                i += 4;
                continue;
              }
            }
            i += o ? 1 : 2;
          }
          return -1;
        }
        return (function kI(n, t) {
          let e = n.indexOf(4);
          if (e > -1)
            for (e++; e < n.length; ) {
              const r = n[e];
              if ("number" == typeof r) return -1;
              if (r === t) return e;
              e++;
            }
          return -1;
        })(t, n);
      }
      function Yg(n, t, e = !1) {
        for (let r = 0; r < t.length; r++) if (FI(n, t[r], e)) return !0;
        return !1;
      }
      function OI(n, t) {
        e: for (let e = 0; e < t.length; e++) {
          const r = t[e];
          if (n.length === r.length) {
            for (let i = 0; i < n.length; i++) if (n[i] !== r[i]) continue e;
            return !0;
          }
        }
        return !1;
      }
      function Zg(n, t) {
        return n ? ":not(" + t.trim() + ")" : t;
      }
      function PI(n) {
        let t = n[0],
          e = 1,
          r = 2,
          i = "",
          o = !1;
        for (; e < n.length; ) {
          let s = n[e];
          if ("string" == typeof s)
            if (2 & r) {
              const a = n[++e];
              i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (i += "." + s) : 4 & r && (i += " " + s);
          else
            "" !== i && !sn(s) && ((t += Zg(o, i)), (i = "")),
              (r = s),
              (o = o || !sn(r));
          e++;
        }
        return "" !== i && (t += Zg(o, i)), t;
      }
      const j = {};
      function _e(n) {
        Xg(ee(), C(), pt() + n, !1);
      }
      function Xg(n, t, e, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const o = n.preOrderCheckHooks;
            null !== o && Ca(t, o, e);
          } else {
            const o = n.preOrderHooks;
            null !== o && Da(t, o, 0, e);
          }
        Fr(e);
      }
      function ny(n, t = null, e = null, r) {
        const i = ry(n, t, e, r);
        return i.resolveInjectorInitializers(), i;
      }
      function ry(n, t = null, e = null, r, i = new Set()) {
        const o = [e || ae, tI(n)];
        return (
          (r = r || ("object" == typeof n ? void 0 : be(n))),
          new jg(o, t || Ua(), r || null, i)
        );
      }
      let zt = (() => {
        class n {
          static create(e, r) {
            if (Array.isArray(e)) return ny({ name: "" }, r, e, "");
            {
              const i = e.name ?? "";
              return ny({ name: i }, e.parent, e.providers, i);
            }
          }
        }
        return (
          (n.THROW_IF_NOT_FOUND = wo),
          (n.NULL = new Lg()),
          (n.ɵprov = I({ token: n, providedIn: "any", factory: () => v(Og) })),
          (n.__NG_ELEMENT_ID__ = -1),
          n
        );
      })();
      function g(n, t = P.Default) {
        const e = C();
        return null === e ? v(n, t) : Rm(Ze(), e, O(n), t);
      }
      function dy(n, t) {
        const e = n.contentQueries;
        if (null !== e)
          for (let r = 0; r < e.length; r += 2) {
            const i = e[r],
              o = e[r + 1];
            if (-1 !== o) {
              const s = n.data[o];
              pc(i), s.contentQueries(2, t[o], o);
            }
          }
      }
      function $a(n, t, e, r, i, o, s, a, l, u, c) {
        const d = t.blueprint.slice();
        return (
          (d[0] = i),
          (d[2] = 76 | r),
          (null !== c || (n && 1024 & n[2])) && (d[2] |= 1024),
          am(d),
          (d[3] = d[15] = n),
          (d[8] = e),
          (d[10] = s || (n && n[10])),
          (d[G] = a || (n && n[G])),
          (d[12] = l || (n && n[12]) || null),
          (d[9] = u || (n && n[9]) || null),
          (d[6] = o),
          (d[20] = (function ZA() {
            return YA++;
          })()),
          (d[21] = c),
          (d[16] = 2 == t.type ? n[16] : d),
          d
        );
      }
      function Ni(n, t, e, r, i) {
        let o = n.data[t];
        if (null === o)
          (o = (function pd(n, t, e, r, i) {
            const o = hm(),
              s = cc(),
              l = (n.data[t] = (function lT(n, t, e, r, i, o) {
                return {
                  type: e,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  componentOffset: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: i,
                  attrs: o,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? o : o && o.parent, e, t, r, i));
            return (
              null === n.firstChild && (n.firstChild = l),
              null !== o &&
                (s
                  ? null == o.child && null !== l.parent && (o.child = l)
                  : null === o.next && (o.next = l)),
              l
            );
          })(n, t, e, r, i)),
            (function tA() {
              return U.lFrame.inI18n;
            })() && (o.flags |= 32);
        else if (64 & o.type) {
          (o.type = e), (o.value = r), (o.attrs = i);
          const s = (function Ro() {
            const n = U.lFrame,
              t = n.currentTNode;
            return n.isParent ? t : t.parent;
          })();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return _n(o, !0), o;
      }
      function Wo(n, t, e, r) {
        if (0 === e) return -1;
        const i = t.length;
        for (let o = 0; o < e; o++)
          t.push(r), n.blueprint.push(r), n.data.push(null);
        return i;
      }
      function md(n, t, e) {
        mc(t);
        try {
          const r = n.viewQuery;
          null !== r && Md(1, r, e);
          const i = n.template;
          null !== i && hy(n, t, i, 1, e),
            n.firstCreatePass && (n.firstCreatePass = !1),
            n.staticContentQueries && dy(n, t),
            n.staticViewQueries && Md(2, n.viewQuery, e);
          const o = n.components;
          null !== o &&
            (function oT(n, t) {
              for (let e = 0; e < t.length; e++) AT(n, t[e]);
            })(t, o);
        } catch (r) {
          throw (
            (n.firstCreatePass &&
              ((n.incompleteFirstPass = !0), (n.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[2] &= -5), gc();
        }
      }
      function za(n, t, e, r) {
        const i = t[2];
        if (128 != (128 & i)) {
          mc(t);
          try {
            am(t),
              (function pm(n) {
                return (U.lFrame.bindingIndex = n);
              })(n.bindingStartIndex),
              null !== e && hy(n, t, e, 2, r);
            const s = 3 == (3 & i);
            if (s) {
              const u = n.preOrderCheckHooks;
              null !== u && Ca(t, u, null);
            } else {
              const u = n.preOrderHooks;
              null !== u && Da(t, u, 0, null), yc(t, 0);
            }
            if (
              ((function MT(n) {
                for (let t = Vc(n); null !== t; t = Bc(t)) {
                  if (!t[2]) continue;
                  const e = t[9];
                  for (let r = 0; r < e.length; r++) {
                    const i = e[r],
                      o = i[3];
                    0 == (512 & i[2]) && uc(o, 1), (i[2] |= 512);
                  }
                }
              })(t),
              (function wT(n) {
                for (let t = Vc(n); null !== t; t = Bc(t))
                  for (let e = 10; e < t.length; e++) {
                    const r = t[e],
                      i = r[1];
                    va(r) && za(i, r, i.template, r[8]);
                  }
              })(t),
              null !== n.contentQueries && dy(n, t),
              s)
            ) {
              const u = n.contentCheckHooks;
              null !== u && Ca(t, u);
            } else {
              const u = n.contentHooks;
              null !== u && Da(t, u, 1), yc(t, 1);
            }
            !(function rT(n, t) {
              const e = n.hostBindingOpCodes;
              if (null !== e)
                try {
                  for (let r = 0; r < e.length; r++) {
                    const i = e[r];
                    if (i < 0) Fr(~i);
                    else {
                      const o = i,
                        s = e[++r],
                        a = e[++r];
                      nA(s, o), a(2, t[o]);
                    }
                  }
                } finally {
                  Fr(-1);
                }
            })(n, t);
            const a = n.components;
            null !== a &&
              (function iT(n, t) {
                for (let e = 0; e < t.length; e++) ST(n, t[e]);
              })(t, a);
            const l = n.viewQuery;
            if ((null !== l && Md(2, l, r), s)) {
              const u = n.viewCheckHooks;
              null !== u && Ca(t, u);
            } else {
              const u = n.viewHooks;
              null !== u && Da(t, u, 2), yc(t, 2);
            }
            !0 === n.firstUpdatePass && (n.firstUpdatePass = !1),
              (t[2] &= -41),
              512 & t[2] && ((t[2] &= -513), uc(t[3], -1));
          } finally {
            gc();
          }
        }
      }
      function hy(n, t, e, r, i) {
        const o = pt(),
          s = 2 & r;
        try {
          Fr(-1), s && t.length > 22 && Xg(n, t, 22, !1), e(r, i);
        } finally {
          Fr(o);
        }
      }
      function gd(n, t, e) {
        if (ac(t)) {
          const i = t.directiveEnd;
          for (let o = t.directiveStart; o < i; o++) {
            const s = n.data[o];
            s.contentQueries && s.contentQueries(1, e[o], o);
          }
        }
      }
      function yd(n, t, e) {
        !um() ||
          ((function pT(n, t, e, r) {
            const i = e.directiveStart,
              o = e.directiveEnd;
            xo(e) &&
              (function CT(n, t, e) {
                const r = Tt(t, n),
                  i = fy(e),
                  o = n[10],
                  s = Ga(
                    n,
                    $a(
                      n,
                      i,
                      null,
                      e.onPush ? 32 : 16,
                      r,
                      t,
                      o,
                      o.createRenderer(r, e),
                      null,
                      null,
                      null
                    )
                  );
                n[t.index] = s;
              })(t, e, n.data[i + e.componentOffset]),
              n.firstCreatePass || Sa(e, t),
              it(r, t);
            const s = e.initialInputs;
            for (let a = i; a < o; a++) {
              const l = n.data[a],
                u = xr(t, n, a, e);
              it(u, t),
                null !== s && DT(0, a - i, u, l, 0, s),
                on(l) && (Ft(e.index, t)[8] = xr(t, n, a, e));
            }
          })(n, t, e, Tt(e, t)),
          64 == (64 & e.flags) && vy(n, t, e));
      }
      function _d(n, t, e = Tt) {
        const r = t.localNames;
        if (null !== r) {
          let i = t.index + 1;
          for (let o = 0; o < r.length; o += 2) {
            const s = r[o + 1],
              a = -1 === s ? e(t, n) : n[s];
            n[i++] = a;
          }
        }
      }
      function fy(n) {
        const t = n.tView;
        return null === t || t.incompleteFirstPass
          ? (n.tView = vd(
              1,
              null,
              n.template,
              n.decls,
              n.vars,
              n.directiveDefs,
              n.pipeDefs,
              n.viewQuery,
              n.schemas,
              n.consts
            ))
          : t;
      }
      function vd(n, t, e, r, i, o, s, a, l, u) {
        const c = 22 + r,
          d = c + i,
          h = (function sT(n, t) {
            const e = [];
            for (let r = 0; r < t; r++) e.push(r < n ? null : j);
            return e;
          })(c, d),
          f = "function" == typeof u ? u() : u;
        return (h[1] = {
          type: n,
          blueprint: h,
          template: e,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: h.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof o ? o() : o,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: f,
          incompleteFirstPass: !1,
        });
      }
      function py(n, t, e, r) {
        const i = Cy(t);
        null === e
          ? i.push(r)
          : (i.push(e), n.firstCreatePass && Dy(n).push(r, i.length - 1));
      }
      function my(n, t, e, r) {
        for (let i in n)
          if (n.hasOwnProperty(i)) {
            e = null === e ? {} : e;
            const o = n[i];
            null === r
              ? gy(e, t, i, o)
              : r.hasOwnProperty(i) && gy(e, t, r[i], o);
          }
        return e;
      }
      function gy(n, t, e, r) {
        n.hasOwnProperty(e) ? n[e].push(t, r) : (n[e] = [t, r]);
      }
      function Nt(n, t, e, r, i, o, s, a) {
        const l = Tt(t, e);
        let c,
          u = t.inputs;
        !a && null != u && (c = u[r])
          ? (Sd(n, e, c, r, i), xo(t) && yy(e, t.index))
          : 3 & t.type &&
            ((r = (function cT(n) {
              return "class" === n
                ? "className"
                : "for" === n
                ? "htmlFor"
                : "formaction" === n
                ? "formAction"
                : "innerHtml" === n
                ? "innerHTML"
                : "readonly" === n
                ? "readOnly"
                : "tabindex" === n
                ? "tabIndex"
                : n;
            })(r)),
            (i = null != s ? s(i, t.value || "", r) : i),
            o.setProperty(l, r, i));
      }
      function yy(n, t) {
        const e = Ft(t, n);
        16 & e[2] || (e[2] |= 32);
      }
      function bd(n, t, e, r) {
        let i = !1;
        if (um()) {
          const o = null === r ? null : { "": -1 },
            s = (function gT(n, t) {
              const e = n.directiveRegistry;
              let r = null,
                i = null;
              if (e)
                for (let o = 0; o < e.length; o++) {
                  const s = e[o];
                  if (Yg(t, s.selectors, !1))
                    if ((r || (r = []), on(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (i = i || new Map()),
                          s.findHostDirectiveDefs(s, a, i),
                          r.unshift(...a, s),
                          Cd(n, t, a.length);
                      } else r.unshift(s), Cd(n, t, 0);
                    else
                      (i = i || new Map()),
                        s.findHostDirectiveDefs?.(s, r, i),
                        r.push(s);
                }
              return null === r ? null : [r, i];
            })(n, e);
          let a, l;
          null === s ? (a = l = null) : ([a, l] = s),
            null !== a && ((i = !0), _y(n, t, e, a, o, l)),
            o &&
              (function yT(n, t, e) {
                if (t) {
                  const r = (n.localNames = []);
                  for (let i = 0; i < t.length; i += 2) {
                    const o = e[t[i + 1]];
                    if (null == o) throw new b(-301, !1);
                    r.push(t[i], o);
                  }
                }
              })(e, r, o);
        }
        return (e.mergedAttrs = ko(e.mergedAttrs, e.attrs)), i;
      }
      function _y(n, t, e, r, i, o) {
        for (let u = 0; u < r.length; u++) Ec(Sa(e, t), n, r[u].type);
        !(function vT(n, t, e) {
          (n.flags |= 1),
            (n.directiveStart = t),
            (n.directiveEnd = t + e),
            (n.providerIndexes = t);
        })(e, n.data.length, r.length);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          c.providersResolver && c.providersResolver(c);
        }
        let s = !1,
          a = !1,
          l = Wo(n, t, r.length, null);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          (e.mergedAttrs = ko(e.mergedAttrs, c.hostAttrs)),
            bT(n, e, t, l, c),
            _T(l, c, i),
            null !== c.contentQueries && (e.flags |= 4),
            (null !== c.hostBindings ||
              null !== c.hostAttrs ||
              0 !== c.hostVars) &&
              (e.flags |= 64);
          const d = c.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((n.preOrderHooks || (n.preOrderHooks = [])).push(e.index),
            (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((n.preOrderCheckHooks || (n.preOrderCheckHooks = [])).push(
                e.index
              ),
              (a = !0)),
            l++;
        }
        !(function uT(n, t, e) {
          const i = t.directiveEnd,
            o = n.data,
            s = t.attrs,
            a = [];
          let l = null,
            u = null;
          for (let c = t.directiveStart; c < i; c++) {
            const d = o[c],
              h = e ? e.get(d) : null,
              p = h ? h.outputs : null;
            (l = my(d.inputs, c, l, h ? h.inputs : null)),
              (u = my(d.outputs, c, u, p));
            const m = null === l || null === s || Qg(t) ? null : ET(l, c, s);
            a.push(m);
          }
          null !== l &&
            (l.hasOwnProperty("class") && (t.flags |= 8),
            l.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = l),
            (t.outputs = u);
        })(n, e, o);
      }
      function vy(n, t, e) {
        const r = e.directiveStart,
          i = e.directiveEnd,
          o = e.index,
          s = (function rA() {
            return U.lFrame.currentDirectiveIndex;
          })();
        try {
          Fr(o);
          for (let a = r; a < i; a++) {
            const l = n.data[a],
              u = t[a];
            hc(a),
              (null !== l.hostBindings ||
                0 !== l.hostVars ||
                null !== l.hostAttrs) &&
                mT(l, u);
          }
        } finally {
          Fr(-1), hc(s);
        }
      }
      function mT(n, t) {
        null !== n.hostBindings && n.hostBindings(1, t);
      }
      function Cd(n, t, e) {
        (t.componentOffset = e),
          (n.components || (n.components = [])).push(t.index);
      }
      function _T(n, t, e) {
        if (e) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) e[t.exportAs[r]] = n;
          on(t) && (e[""] = n);
        }
      }
      function bT(n, t, e, r, i) {
        n.data[r] = i;
        const o = i.factory || (i.factory = Tr(i.type)),
          s = new No(o, on(i), g);
        (n.blueprint[r] = s),
          (e[r] = s),
          (function hT(n, t, e, r, i) {
            const o = i.hostBindings;
            if (o) {
              let s = n.hostBindingOpCodes;
              null === s && (s = n.hostBindingOpCodes = []);
              const a = ~t.index;
              (function fT(n) {
                let t = n.length;
                for (; t > 0; ) {
                  const e = n[--t];
                  if ("number" == typeof e && e < 0) return e;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(e, r, o);
            }
          })(n, t, r, Wo(n, e, i.hostVars, j), i);
      }
      function Dn(n, t, e, r, i, o) {
        const s = Tt(n, t);
        !(function Dd(n, t, e, r, i, o, s) {
          if (null == o) n.removeAttribute(t, i, e);
          else {
            const a = null == s ? H(o) : s(o, r || "", i);
            n.setAttribute(t, i, a, e);
          }
        })(t[G], s, o, n.value, e, r, i);
      }
      function DT(n, t, e, r, i, o) {
        const s = o[t];
        if (null !== s) {
          const a = r.setInput;
          for (let l = 0; l < s.length; ) {
            const u = s[l++],
              c = s[l++],
              d = s[l++];
            null !== a ? r.setInput(e, d, u, c) : (e[c] = d);
          }
        }
      }
      function ET(n, t, e) {
        let r = null,
          i = 0;
        for (; i < e.length; ) {
          const o = e[i];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              if (n.hasOwnProperty(o)) {
                null === r && (r = []);
                const s = n[o];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === t) {
                    r.push(o, s[a + 1], e[i + 1]);
                    break;
                  }
              }
              i += 2;
            } else i += 2;
          else i += 4;
        }
        return r;
      }
      function by(n, t, e, r) {
        return [n, !0, !1, t, null, 0, r, e, null, null];
      }
      function ST(n, t) {
        const e = Ft(t, n);
        if (va(e)) {
          const r = e[1];
          48 & e[2] ? za(r, e, r.template, e[8]) : e[5] > 0 && Ed(e);
        }
      }
      function Ed(n) {
        for (let r = Vc(n); null !== r; r = Bc(r))
          for (let i = 10; i < r.length; i++) {
            const o = r[i];
            if (va(o))
              if (512 & o[2]) {
                const s = o[1];
                za(s, o, s.template, o[8]);
              } else o[5] > 0 && Ed(o);
          }
        const e = n[1].components;
        if (null !== e)
          for (let r = 0; r < e.length; r++) {
            const i = Ft(e[r], n);
            va(i) && i[5] > 0 && Ed(i);
          }
      }
      function AT(n, t) {
        const e = Ft(t, n),
          r = e[1];
        (function IT(n, t) {
          for (let e = t.length; e < n.blueprint.length; e++)
            t.push(n.blueprint[e]);
        })(r, e),
          md(r, e, e[8]);
      }
      function Ga(n, t) {
        return n[13] ? (n[14][4] = t) : (n[13] = t), (n[14] = t), t;
      }
      function wd(n) {
        for (; n; ) {
          n[2] |= 32;
          const t = Uo(n);
          if (LS(n) && !t) return n;
          n = t;
        }
        return null;
      }
      function qa(n, t, e, r = !0) {
        const i = t[10];
        i.begin && i.begin();
        try {
          za(n, t, n.template, e);
        } catch (s) {
          throw (r && wy(t, s), s);
        } finally {
          i.end && i.end();
        }
      }
      function Md(n, t, e) {
        pc(0), t(n, e);
      }
      function Cy(n) {
        return n[7] || (n[7] = []);
      }
      function Dy(n) {
        return n.cleanup || (n.cleanup = []);
      }
      function wy(n, t) {
        const e = n[9],
          r = e ? e.get(Cn, null) : null;
        r && r.handleError(t);
      }
      function Sd(n, t, e, r, i) {
        for (let o = 0; o < e.length; ) {
          const s = e[o++],
            a = e[o++],
            l = t[s],
            u = n.data[s];
          null !== u.setInput ? u.setInput(l, i, r, a) : (l[a] = i);
        }
      }
      function Wa(n, t, e) {
        let r = e ? n.styles : null,
          i = e ? n.classes : null,
          o = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (o = a)
              : 1 == o
              ? (i = Yu(i, a))
              : 2 == o && (r = Yu(r, a + ": " + t[++s] + ";"));
          }
        e ? (n.styles = r) : (n.stylesWithoutHost = r),
          e ? (n.classes = i) : (n.classesWithoutHost = i);
      }
      function Ka(n, t, e, r, i = !1) {
        for (; null !== e; ) {
          const o = t[e.index];
          if ((null !== o && r.push(Ye(o)), rn(o)))
            for (let a = 10; a < o.length; a++) {
              const l = o[a],
                u = l[1].firstChild;
              null !== u && Ka(l[1], l, u, r);
            }
          const s = e.type;
          if (8 & s) Ka(n, t, e.child, r);
          else if (32 & s) {
            const a = Lc(e, t);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = yg(t, e);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = Uo(t[16]);
              Ka(l[1], l, a, r, !0);
            }
          }
          e = i ? e.projectionNext : e.next;
        }
        return r;
      }
      class Ko {
        constructor(t, e) {
          (this._lView = t),
            (this._cdRefInjectingView = e),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const t = this._lView,
            e = t[1];
          return Ka(e, t, e.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 128 == (128 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (rn(t)) {
              const e = t[8],
                r = e ? e.indexOf(this) : -1;
              r > -1 && (jc(t, r), Ia(e, r));
            }
            this._attachedToViewContainer = !1;
          }
          lg(this._lView[1], this._lView);
        }
        onDestroy(t) {
          py(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          wd(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          qa(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new b(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function f0(n, t) {
              jo(n, t, t[G], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new b(902, !1);
          this._appRef = t;
        }
      }
      class TT extends Ko {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          qa(t[1], t, t[8], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class My extends Go {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const e = he(t);
          return new Qo(e, this.ngModule);
        }
      }
      function Sy(n) {
        const t = [];
        for (let e in n)
          n.hasOwnProperty(e) && t.push({ propName: n[e], templateName: e });
        return t;
      }
      class xT {
        constructor(t, e) {
          (this.injector = t), (this.parentInjector = e);
        }
        get(t, e, r) {
          r = da(r);
          const i = this.injector.get(t, ad, r);
          return i !== ad || e === ad ? i : this.parentInjector.get(t, e, r);
        }
      }
      class Qo extends zg {
        constructor(t, e) {
          super(),
            (this.componentDef = t),
            (this.ngModule = e),
            (this.componentType = t.type),
            (this.selector = (function LI(n) {
              return n.map(PI).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!e);
        }
        get inputs() {
          return Sy(this.componentDef.inputs);
        }
        get outputs() {
          return Sy(this.componentDef.outputs);
        }
        create(t, e, r, i) {
          let o = (i = i || this.ngModule) instanceof Bn ? i : i?.injector;
          o &&
            null !== this.componentDef.getStandaloneInjector &&
            (o = this.componentDef.getStandaloneInjector(o) || o);
          const s = o ? new xT(t, o) : t,
            a = s.get(qo, null);
          if (null === a) throw new b(407, !1);
          const l = s.get(gI, null),
            u = a.createRenderer(null, this.componentDef),
            c = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function aT(n, t, e) {
                  return n.selectRootElement(t, e === tn.ShadowDom);
                })(u, r, this.componentDef.encapsulation)
              : Uc(
                  u,
                  c,
                  (function FT(n) {
                    const t = n.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(c)
                ),
            h = this.componentDef.onPush ? 288 : 272,
            f = vd(0, null, null, 1, 0, null, null, null, null, null),
            p = $a(null, f, null, h, null, null, a, u, l, s, null);
          let m, y;
          mc(p);
          try {
            const D = this.componentDef;
            let E,
              _ = null;
            D.findHostDirectiveDefs
              ? ((E = []),
                (_ = new Map()),
                D.findHostDirectiveDefs(D, E, _),
                E.push(D))
              : (E = [D]);
            const F = (function NT(n, t) {
                const e = n[1];
                return (n[22] = t), Ni(e, 22, 2, "#host", null);
              })(p, d),
              te = (function kT(n, t, e, r, i, o, s, a) {
                const l = i[1];
                !(function OT(n, t, e, r) {
                  for (const i of n)
                    t.mergedAttrs = ko(t.mergedAttrs, i.hostAttrs);
                  null !== t.mergedAttrs &&
                    (Wa(t, t.mergedAttrs, !0), null !== e && bg(r, e, t));
                })(r, n, t, s);
                const u = o.createRenderer(t, e),
                  c = $a(
                    i,
                    fy(e),
                    null,
                    e.onPush ? 32 : 16,
                    i[n.index],
                    n,
                    o,
                    u,
                    a || null,
                    null,
                    null
                  );
                return (
                  l.firstCreatePass && Cd(l, n, r.length - 1),
                  Ga(i, c),
                  (i[n.index] = c)
                );
              })(F, d, D, E, p, a, u);
            (y = sm(f, 22)),
              d &&
                (function LT(n, t, e, r) {
                  if (r) vc(n, e, ["ng-version", yI.full]);
                  else {
                    const { attrs: i, classes: o } = (function VI(n) {
                      const t = [],
                        e = [];
                      let r = 1,
                        i = 2;
                      for (; r < n.length; ) {
                        let o = n[r];
                        if ("string" == typeof o)
                          2 === i
                            ? "" !== o && t.push(o, n[++r])
                            : 8 === i && e.push(o);
                        else {
                          if (!sn(i)) break;
                          i = o;
                        }
                        r++;
                      }
                      return { attrs: t, classes: e };
                    })(t.selectors[0]);
                    i && vc(n, e, i),
                      o && o.length > 0 && vg(n, e, o.join(" "));
                  }
                })(u, D, d, r),
              void 0 !== e &&
                (function VT(n, t, e) {
                  const r = (n.projection = []);
                  for (let i = 0; i < t.length; i++) {
                    const o = e[i];
                    r.push(null != o ? Array.from(o) : null);
                  }
                })(y, this.ngContentSelectors, e),
              (m = (function PT(n, t, e, r, i, o) {
                const s = Ze(),
                  a = i[1],
                  l = Tt(s, i);
                _y(a, i, s, e, null, r);
                for (let c = 0; c < e.length; c++)
                  it(xr(i, a, s.directiveStart + c, s), i);
                vy(a, i, s), l && it(l, i);
                const u = xr(i, a, s.directiveStart + s.componentOffset, s);
                if (((n[8] = i[8] = u), null !== o)) for (const c of o) c(u, t);
                return gd(a, s, n), u;
              })(te, D, E, _, p, [BT])),
              md(f, p, null);
          } finally {
            gc();
          }
          return new RT(this.componentType, m, Fi(y, p), p, y);
        }
      }
      class RT extends cI {
        constructor(t, e, r, i, o) {
          super(),
            (this.location = r),
            (this._rootLView = i),
            (this._tNode = o),
            (this.instance = e),
            (this.hostView = this.changeDetectorRef = new TT(i)),
            (this.componentType = t);
        }
        setInput(t, e) {
          const r = this._tNode.inputs;
          let i;
          if (null !== r && (i = r[t])) {
            const o = this._rootLView;
            Sd(o[1], o, i, t, e), yy(o, this._tNode.index);
          }
        }
        get injector() {
          return new vi(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function BT() {
        const n = Ze();
        ba(C()[1], n);
      }
      function W(n) {
        let t = (function Ay(n) {
            return Object.getPrototypeOf(n.prototype).constructor;
          })(n.type),
          e = !0;
        const r = [n];
        for (; t; ) {
          let i;
          if (on(n)) i = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new b(903, !1);
            i = t.ɵdir;
          }
          if (i) {
            if (e) {
              r.push(i);
              const s = n;
              (s.inputs = Ad(n.inputs)),
                (s.declaredInputs = Ad(n.declaredInputs)),
                (s.outputs = Ad(n.outputs));
              const a = i.hostBindings;
              a && $T(n, a);
              const l = i.viewQuery,
                u = i.contentQueries;
              if (
                (l && UT(n, l),
                u && jT(n, u),
                Qu(n.inputs, i.inputs),
                Qu(n.declaredInputs, i.declaredInputs),
                Qu(n.outputs, i.outputs),
                on(i) && i.data.animation)
              ) {
                const c = n.data;
                c.animation = (c.animation || []).concat(i.data.animation);
              }
            }
            const o = i.features;
            if (o)
              for (let s = 0; s < o.length; s++) {
                const a = o[s];
                a && a.ngInherit && a(n), a === W && (e = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function HT(n) {
          let t = 0,
            e = null;
          for (let r = n.length - 1; r >= 0; r--) {
            const i = n[r];
            (i.hostVars = t += i.hostVars),
              (i.hostAttrs = ko(i.hostAttrs, (e = ko(e, i.hostAttrs))));
          }
        })(r);
      }
      function Ad(n) {
        return n === Nn ? {} : n === ae ? [] : n;
      }
      function UT(n, t) {
        const e = n.viewQuery;
        n.viewQuery = e
          ? (r, i) => {
              t(r, i), e(r, i);
            }
          : t;
      }
      function jT(n, t) {
        const e = n.contentQueries;
        n.contentQueries = e
          ? (r, i, o) => {
              t(r, i, o), e(r, i, o);
            }
          : t;
      }
      function $T(n, t) {
        const e = n.hostBindings;
        n.hostBindings = e
          ? (r, i) => {
              t(r, i), e(r, i);
            }
          : t;
      }
      let Qa = null;
      function Lr() {
        if (!Qa) {
          const n = De.Symbol;
          if (n && n.iterator) Qa = n.iterator;
          else {
            const t = Object.getOwnPropertyNames(Map.prototype);
            for (let e = 0; e < t.length; ++e) {
              const r = t[e];
              "entries" !== r &&
                "size" !== r &&
                Map.prototype[r] === Map.prototype.entries &&
                (Qa = r);
            }
          }
        }
        return Qa;
      }
      function ot(n, t, e) {
        return !Object.is(n[t], e) && ((n[t] = e), !0);
      }
      function Pe(n, t, e, r) {
        const i = C();
        return ot(i, yi(), t) && (ee(), Dn(Ae(), i, n, t, e, r)), Pe;
      }
      function mt(n, t, e, r, i, o, s, a) {
        const l = C(),
          u = ee(),
          c = n + 22,
          d = u.firstCreatePass
            ? (function JT(n, t, e, r, i, o, s, a, l) {
                const u = t.consts,
                  c = Ni(t, n, 4, s || null, sr(u, a));
                bd(t, e, c, sr(u, l)), ba(t, c);
                const d = (c.tViews = vd(
                  2,
                  c,
                  r,
                  i,
                  o,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  u
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, c),
                    (d.queries = t.queries.embeddedTView(c))),
                  c
                );
              })(c, u, l, t, e, r, i, o, s)
            : u.data[c];
        _n(d, !1);
        const h = l[G].createComment("");
        Na(u, l, h, d),
          it(h, l),
          Ga(l, (l[c] = by(h, l, h, d))),
          ya(d) && yd(u, l, d),
          null != s && _d(l, d, a);
      }
      function ge(n, t, e) {
        const r = C();
        return ot(r, yi(), t) && Nt(ee(), Ae(), r, n, t, r[G], e, !1), ge;
      }
      function Td(n, t, e, r, i) {
        const s = i ? "class" : "style";
        Sd(n, e, t.inputs[s], s, r);
      }
      function re(n, t, e, r) {
        const i = C(),
          o = ee(),
          s = 22 + n,
          a = i[G],
          l = (i[s] = Uc(
            a,
            t,
            (function dA() {
              return U.lFrame.currentNamespace;
            })()
          )),
          u = o.firstCreatePass
            ? (function nF(n, t, e, r, i, o, s) {
                const a = t.consts,
                  u = Ni(t, n, 2, i, sr(a, o));
                return (
                  bd(t, e, u, sr(a, s)),
                  null !== u.attrs && Wa(u, u.attrs, !1),
                  null !== u.mergedAttrs && Wa(u, u.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, u),
                  u
                );
              })(s, o, i, 0, t, e, r)
            : o.data[s];
        return (
          _n(u, !0),
          bg(a, l, u),
          32 != (32 & u.flags) && Na(o, i, l, u),
          0 ===
            (function QS() {
              return U.lFrame.elementDepthCount;
            })() && it(l, i),
          (function YS() {
            U.lFrame.elementDepthCount++;
          })(),
          ya(u) && (yd(o, i, u), gd(o, u, i)),
          null !== r && _d(i, u),
          re
        );
      }
      function ie() {
        let n = Ze();
        cc() ? dc() : ((n = n.parent), _n(n, !1));
        const t = n;
        !(function ZS() {
          U.lFrame.elementDepthCount--;
        })();
        const e = ee();
        return (
          e.firstCreatePass && (ba(e, n), ac(n) && e.queries.elementEnd(n)),
          null != t.classesWithoutHost &&
            (function mA(n) {
              return 0 != (8 & n.flags);
            })(t) &&
            Td(e, t, C(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function gA(n) {
              return 0 != (16 & n.flags);
            })(t) &&
            Td(e, t, C(), t.stylesWithoutHost, !1),
          ie
        );
      }
      function kt(n, t, e, r) {
        return re(n, t, e, r), ie(), kt;
      }
      function Xo(n, t, e) {
        const r = C(),
          i = ee(),
          o = n + 22,
          s = i.firstCreatePass
            ? (function rF(n, t, e, r, i) {
                const o = t.consts,
                  s = sr(o, r),
                  a = Ni(t, n, 8, "ng-container", s);
                return (
                  null !== s && Wa(a, s, !0),
                  bd(t, e, a, sr(o, i)),
                  null !== t.queries && t.queries.elementStart(t, a),
                  a
                );
              })(o, i, r, t, e)
            : i.data[o];
        _n(s, !0);
        const a = (r[o] = r[G].createComment(""));
        return (
          Na(i, r, a, s),
          it(a, r),
          ya(s) && (yd(i, r, s), gd(i, s, r)),
          null != e && _d(r, s),
          Xo
        );
      }
      function Jo() {
        let n = Ze();
        const t = ee();
        return (
          cc() ? dc() : ((n = n.parent), _n(n, !1)),
          t.firstCreatePass && (ba(t, n), ac(n) && t.queries.elementEnd(n)),
          Jo
        );
      }
      function es(n) {
        return !!n && "function" == typeof n.then;
      }
      const Fd = function jy(n) {
        return !!n && "function" == typeof n.subscribe;
      };
      function ke(n, t, e, r) {
        const i = C(),
          o = ee(),
          s = Ze();
        return (
          (function zy(n, t, e, r, i, o, s) {
            const a = ya(r),
              u = n.firstCreatePass && Dy(n),
              c = t[8],
              d = Cy(t);
            let h = !0;
            if (3 & r.type || s) {
              const m = Tt(r, t),
                y = s ? s(m) : m,
                D = d.length,
                E = s ? (F) => s(Ye(F[r.index])) : r.index;
              let _ = null;
              if (
                (!s &&
                  a &&
                  (_ = (function iF(n, t, e, r) {
                    const i = n.cleanup;
                    if (null != i)
                      for (let o = 0; o < i.length - 1; o += 2) {
                        const s = i[o];
                        if (s === e && i[o + 1] === r) {
                          const a = t[7],
                            l = i[o + 2];
                          return a.length > l ? a[l] : null;
                        }
                        "string" == typeof s && (o += 2);
                      }
                    return null;
                  })(n, t, i, r.index)),
                null !== _)
              )
                ((_.__ngLastListenerFn__ || _).__ngNextListenerFn__ = o),
                  (_.__ngLastListenerFn__ = o),
                  (h = !1);
              else {
                o = qy(r, t, c, o, !1);
                const F = e.listen(y, i, o);
                d.push(o, F), u && u.push(i, E, D, D + 1);
              }
            } else o = qy(r, t, c, o, !1);
            const f = r.outputs;
            let p;
            if (h && null !== f && (p = f[i])) {
              const m = p.length;
              if (m)
                for (let y = 0; y < m; y += 2) {
                  const te = t[p[y]][p[y + 1]].subscribe(o),
                    se = d.length;
                  d.push(o, te), u && u.push(i, r.index, se, -(se + 1));
                }
            }
          })(o, i, i[G], s, n, t, r),
          ke
        );
      }
      function Gy(n, t, e, r) {
        try {
          return !1 !== e(r);
        } catch (i) {
          return wy(n, i), !1;
        }
      }
      function qy(n, t, e, r, i) {
        return function o(s) {
          if (s === Function) return r;
          wd(n.componentOffset > -1 ? Ft(n.index, t) : t);
          let l = Gy(t, 0, r, s),
            u = o.__ngNextListenerFn__;
          for (; u; ) (l = Gy(t, 0, u, s) && l), (u = u.__ngNextListenerFn__);
          return i && !1 === l && (s.preventDefault(), (s.returnValue = !1)), l;
        };
      }
      function an(n = 1) {
        return (function oA(n) {
          return (U.lFrame.contextLView = (function sA(n, t) {
            for (; n > 0; ) (t = t[15]), n--;
            return t;
          })(n, U.lFrame.contextLView))[8];
        })(n);
      }
      function oF(n, t) {
        let e = null;
        const r = (function RI(n) {
          const t = n.attrs;
          if (null != t) {
            const e = t.indexOf(5);
            if (0 == (1 & e)) return t[e + 1];
          }
          return null;
        })(n);
        for (let i = 0; i < t.length; i++) {
          const o = t[i];
          if ("*" !== o) {
            if (null === r ? Yg(n, o, !0) : OI(r, o)) return i;
          } else e = i;
        }
        return e;
      }
      function wn(n) {
        const t = C()[16][6];
        if (!t.projection) {
          const r = (t.projection = Lo(n ? n.length : 1, null)),
            i = r.slice();
          let o = t.child;
          for (; null !== o; ) {
            const s = n ? oF(o, n) : 0;
            null !== s &&
              (i[s] ? (i[s].projectionNext = o) : (r[s] = o), (i[s] = o)),
              (o = o.next);
          }
        }
      }
      function Ie(n, t = 0, e) {
        const r = C(),
          i = ee(),
          o = Ni(i, 22 + n, 16, null, e || null);
        null === o.projection && (o.projection = t),
          dc(),
          32 != (32 & o.flags) &&
            (function C0(n, t, e) {
              _g(t[G], 0, t, e, ug(n, e, t), fg(e.parent || t[6], e, t));
            })(i, r, o);
      }
      function Za(n, t) {
        return (n << 17) | (t << 2);
      }
      function ur(n) {
        return (n >> 17) & 32767;
      }
      function Rd(n) {
        return 2 | n;
      }
      function Br(n) {
        return (131068 & n) >> 2;
      }
      function Nd(n, t) {
        return (-131069 & n) | (t << 2);
      }
      function kd(n) {
        return 1 | n;
      }
      function n_(n, t, e, r, i) {
        const o = n[e + 1],
          s = null === t;
        let a = r ? ur(o) : Br(o),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const c = n[a + 1];
          dF(n[a], t) && ((l = !0), (n[a + 1] = r ? kd(c) : Rd(c))),
            (a = r ? ur(c) : Br(c));
        }
        l && (n[e + 1] = r ? Rd(o) : kd(o));
      }
      function dF(n, t) {
        return (
          null === n ||
          null == t ||
          (Array.isArray(n) ? n[1] : n) === t ||
          (!(!Array.isArray(n) || "string" != typeof t) && Mi(n, t) >= 0)
        );
      }
      function Le(n, t) {
        return (
          (function ln(n, t, e, r) {
            const i = C(),
              o = ee(),
              s = (function Ln(n) {
                const t = U.lFrame,
                  e = t.bindingIndex;
                return (t.bindingIndex = t.bindingIndex + n), e;
              })(2);
            o.firstUpdatePass &&
              (function d_(n, t, e, r) {
                const i = n.data;
                if (null === i[e + 1]) {
                  const o = i[pt()],
                    s = (function c_(n, t) {
                      return t >= n.expandoStartIndex;
                    })(n, e);
                  (function m_(n, t) {
                    return 0 != (n.flags & (t ? 8 : 16));
                  })(o, r) &&
                    null === t &&
                    !s &&
                    (t = !1),
                    (t = (function bF(n, t, e, r) {
                      const i = (function fc(n) {
                        const t = U.lFrame.currentDirectiveIndex;
                        return -1 === t ? null : n[t];
                      })(n);
                      let o = r ? t.residualClasses : t.residualStyles;
                      if (null === i)
                        0 === (r ? t.classBindings : t.styleBindings) &&
                          ((e = ts((e = Od(null, n, t, e, r)), t.attrs, r)),
                          (o = null));
                      else {
                        const s = t.directiveStylingLast;
                        if (-1 === s || n[s] !== i)
                          if (((e = Od(i, n, t, e, r)), null === o)) {
                            let l = (function CF(n, t, e) {
                              const r = e ? t.classBindings : t.styleBindings;
                              if (0 !== Br(r)) return n[ur(r)];
                            })(n, t, r);
                            void 0 !== l &&
                              Array.isArray(l) &&
                              ((l = Od(null, n, t, l[1], r)),
                              (l = ts(l, t.attrs, r)),
                              (function DF(n, t, e, r) {
                                n[ur(e ? t.classBindings : t.styleBindings)] =
                                  r;
                              })(n, t, r, l));
                          } else
                            o = (function EF(n, t, e) {
                              let r;
                              const i = t.directiveEnd;
                              for (
                                let o = 1 + t.directiveStylingLast;
                                o < i;
                                o++
                              )
                                r = ts(r, n[o].hostAttrs, e);
                              return ts(r, t.attrs, e);
                            })(n, t, r);
                      }
                      return (
                        void 0 !== o &&
                          (r
                            ? (t.residualClasses = o)
                            : (t.residualStyles = o)),
                        e
                      );
                    })(i, o, t, r)),
                    (function uF(n, t, e, r, i, o) {
                      let s = o ? t.classBindings : t.styleBindings,
                        a = ur(s),
                        l = Br(s);
                      n[r] = e;
                      let c,
                        u = !1;
                      if (Array.isArray(e)) {
                        const d = e;
                        (c = d[1]), (null === c || Mi(d, c) > 0) && (u = !0);
                      } else c = e;
                      if (i)
                        if (0 !== l) {
                          const h = ur(n[a + 1]);
                          (n[r + 1] = Za(h, a)),
                            0 !== h && (n[h + 1] = Nd(n[h + 1], r)),
                            (n[a + 1] = (function aF(n, t) {
                              return (131071 & n) | (t << 17);
                            })(n[a + 1], r));
                        } else
                          (n[r + 1] = Za(a, 0)),
                            0 !== a && (n[a + 1] = Nd(n[a + 1], r)),
                            (a = r);
                      else
                        (n[r + 1] = Za(l, 0)),
                          0 === a ? (a = r) : (n[l + 1] = Nd(n[l + 1], r)),
                          (l = r);
                      u && (n[r + 1] = Rd(n[r + 1])),
                        n_(n, c, r, !0),
                        n_(n, c, r, !1),
                        (function cF(n, t, e, r, i) {
                          const o = i ? n.residualClasses : n.residualStyles;
                          null != o &&
                            "string" == typeof t &&
                            Mi(o, t) >= 0 &&
                            (e[r + 1] = kd(e[r + 1]));
                        })(t, c, n, r, o),
                        (s = Za(a, l)),
                        o ? (t.classBindings = s) : (t.styleBindings = s);
                    })(i, o, t, e, s, r);
                }
              })(o, n, s, r),
              t !== j &&
                ot(i, s, t) &&
                (function f_(n, t, e, r, i, o, s, a) {
                  if (!(3 & t.type)) return;
                  const l = n.data,
                    u = l[a + 1],
                    c = (function lF(n) {
                      return 1 == (1 & n);
                    })(u)
                      ? p_(l, t, e, i, Br(u), s)
                      : void 0;
                  Xa(c) ||
                    (Xa(o) ||
                      ((function sF(n) {
                        return 2 == (2 & n);
                      })(u) &&
                        (o = p_(l, null, e, i, a, s))),
                    (function E0(n, t, e, r, i) {
                      if (t) i ? n.addClass(e, r) : n.removeClass(e, r);
                      else {
                        let o = -1 === r.indexOf("-") ? void 0 : Et.DashCase;
                        null == i
                          ? n.removeStyle(e, r, o)
                          : ("string" == typeof i &&
                              i.endsWith("!important") &&
                              ((i = i.slice(0, -10)), (o |= Et.Important)),
                            n.setStyle(e, r, i, o));
                      }
                    })(r, s, _a(pt(), e), i, o));
                })(
                  o,
                  o.data[pt()],
                  i,
                  i[G],
                  n,
                  (i[s + 1] = (function SF(n, t) {
                    return (
                      null == n ||
                        ("string" == typeof t
                          ? (n += t)
                          : "object" == typeof n &&
                            (n = be(
                              (function Rt(n) {
                                return n instanceof Or
                                  ? n.changingThisBreaksApplicationSecurity
                                  : n;
                              })(n)
                            ))),
                      n
                    );
                  })(t, e)),
                  r,
                  s
                );
          })(n, t, null, !0),
          Le
        );
      }
      function Od(n, t, e, r, i) {
        let o = null;
        const s = e.directiveEnd;
        let a = e.directiveStylingLast;
        for (
          -1 === a ? (a = e.directiveStart) : a++;
          a < s && ((o = t[a]), (r = ts(r, o.hostAttrs, i)), o !== n);

        )
          a++;
        return null !== n && (e.directiveStylingLast = a), r;
      }
      function ts(n, t, e) {
        const r = e ? 1 : 2;
        let i = -1;
        if (null !== t)
          for (let o = 0; o < t.length; o++) {
            const s = t[o];
            "number" == typeof s
              ? (i = s)
              : i === r &&
                (Array.isArray(n) || (n = void 0 === n ? [] : ["", n]),
                xt(n, s, !!e || t[++o]));
          }
        return void 0 === n ? null : n;
      }
      function p_(n, t, e, r, i, o) {
        const s = null === t;
        let a;
        for (; i > 0; ) {
          const l = n[i],
            u = Array.isArray(l),
            c = u ? l[1] : l,
            d = null === c;
          let h = e[i + 1];
          h === j && (h = d ? ae : void 0);
          let f = d ? Ac(h, r) : c === r ? h : void 0;
          if ((u && !Xa(f) && (f = Ac(l, r)), Xa(f) && ((a = f), s))) return a;
          const p = n[i + 1];
          i = s ? ur(p) : Br(p);
        }
        if (null !== t) {
          let l = o ? t.residualClasses : t.residualStyles;
          null != l && (a = Ac(l, r));
        }
        return a;
      }
      function Xa(n) {
        return void 0 !== n;
      }
      function cn(n, t = "") {
        const e = C(),
          r = ee(),
          i = n + 22,
          o = r.firstCreatePass ? Ni(r, i, 1, t, null) : r.data[i],
          s = (e[i] = (function Hc(n, t) {
            return n.createText(t);
          })(e[G], t));
        Na(r, e, s, o), _n(o, !1);
      }
      function Hr(n) {
        return ns("", n, ""), Hr;
      }
      function ns(n, t, e) {
        const r = C(),
          i = (function Oi(n, t, e, r) {
            return ot(n, yi(), e) ? t + H(e) + r : j;
          })(r, n, t, e);
        return (
          i !== j &&
            (function jn(n, t, e) {
              const r = _a(t, n);
              !(function sg(n, t, e) {
                n.setValue(t, e);
              })(n[G], r, e);
            })(r, pt(), i),
          ns
        );
      }
      function Ja(n, t, e) {
        const r = C();
        return ot(r, yi(), t) && Nt(ee(), Ae(), r, n, t, r[G], e, !0), Ja;
      }
      const Gi = "en-US";
      let P_ = Gi;
      function Vd(n, t, e, r, i) {
        if (((n = O(n)), Array.isArray(n)))
          for (let o = 0; o < n.length; o++) Vd(n[o], t, e, r, i);
        else {
          const o = ee(),
            s = C();
          let a = Pr(n) ? n : O(n.provide),
            l = $g(n);
          const u = Ze(),
            c = 1048575 & u.providerIndexes,
            d = u.directiveStart,
            h = u.providerIndexes >> 20;
          if (Pr(n) || !n.multi) {
            const f = new No(l, i, g),
              p = Hd(a, t, i ? c : c + h, d);
            -1 === p
              ? (Ec(Sa(u, s), o, a),
                Bd(o, n, t.length),
                t.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                i && (u.providerIndexes += 1048576),
                e.push(f),
                s.push(f))
              : ((e[p] = f), (s[p] = f));
          } else {
            const f = Hd(a, t, c + h, d),
              p = Hd(a, t, c, c + h),
              m = f >= 0 && e[f],
              y = p >= 0 && e[p];
            if ((i && !y) || (!i && !m)) {
              Ec(Sa(u, s), o, a);
              const D = (function zx(n, t, e, r, i) {
                const o = new No(n, e, g);
                return (
                  (o.multi = []),
                  (o.index = t),
                  (o.componentProviders = 0),
                  av(o, i, r && !e),
                  o
                );
              })(i ? $x : jx, e.length, i, r, l);
              !i && y && (e[p].providerFactory = D),
                Bd(o, n, t.length, 0),
                t.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                i && (u.providerIndexes += 1048576),
                e.push(D),
                s.push(D);
            } else Bd(o, n, f > -1 ? f : p, av(e[i ? p : f], l, !i && r));
            !i && r && y && e[p].componentProviders++;
          }
        }
      }
      function Bd(n, t, e, r) {
        const i = Pr(t),
          o = (function rI(n) {
            return !!n.useClass;
          })(t);
        if (i || o) {
          const l = (o ? O(t.useClass) : t).prototype.ngOnDestroy;
          if (l) {
            const u = n.destroyHooks || (n.destroyHooks = []);
            if (!i && t.multi) {
              const c = u.indexOf(e);
              -1 === c ? u.push(e, [r, l]) : u[c + 1].push(r, l);
            } else u.push(e, l);
          }
        }
      }
      function av(n, t, e) {
        return e && n.componentProviders++, n.multi.push(t) - 1;
      }
      function Hd(n, t, e, r) {
        for (let i = e; i < r; i++) if (t[i] === n) return i;
        return -1;
      }
      function jx(n, t, e, r) {
        return Ud(this.multi, []);
      }
      function $x(n, t, e, r) {
        const i = this.multi;
        let o;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = xr(e, e[1], this.providerFactory.index, r);
          (o = a.slice(0, s)), Ud(i, o);
          for (let l = s; l < a.length; l++) o.push(a[l]);
        } else (o = []), Ud(i, o);
        return o;
      }
      function Ud(n, t) {
        for (let e = 0; e < n.length; e++) t.push((0, n[e])());
        return t;
      }
      function oe(n, t = []) {
        return (e) => {
          e.providersResolver = (r, i) =>
            (function Ux(n, t, e) {
              const r = ee();
              if (r.firstCreatePass) {
                const i = on(n);
                Vd(e, r.data, r.blueprint, i, !0),
                  Vd(t, r.data, r.blueprint, i, !1);
              }
            })(r, i ? i(n) : n, t);
        };
      }
      class qi {}
      class lv {}
      class uv extends qi {
        constructor(t, e) {
          super(),
            (this._parent = e),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new My(this));
          const r = At(t);
          (this._bootstrapComponents = Un(r.bootstrap)),
            (this._r3Injector = ry(
              t,
              e,
              [
                { provide: qi, useValue: this },
                { provide: Go, useValue: this.componentFactoryResolver },
              ],
              be(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((e) => e()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class jd extends lv {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new uv(this.moduleType, t);
        }
      }
      class qx extends qi {
        constructor(t, e, r) {
          super(),
            (this.componentFactoryResolver = new My(this)),
            (this.instance = null);
          const i = new jg(
            [
              ...t,
              { provide: qi, useValue: this },
              { provide: Go, useValue: this.componentFactoryResolver },
            ],
            e || Ua(),
            r,
            new Set(["environment"])
          );
          (this.injector = i), i.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function il(n, t, e = null) {
        return new qx(n, t, e).injector;
      }
      let Wx = (() => {
        class n {
          constructor(e) {
            (this._injector = e), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(e) {
            if (!e.standalone) return null;
            if (!this.cachedInjectors.has(e.id)) {
              const r = Vg(0, e.type),
                i =
                  r.length > 0
                    ? il([r], this._injector, `Standalone[${e.type.name}]`)
                    : null;
              this.cachedInjectors.set(e.id, i);
            }
            return this.cachedInjectors.get(e.id);
          }
          ngOnDestroy() {
            try {
              for (const e of this.cachedInjectors.values())
                null !== e && e.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (n.ɵprov = I({
            token: n,
            providedIn: "environment",
            factory: () => new n(v(Bn)),
          })),
          n
        );
      })();
      function cv(n) {
        n.getStandaloneInjector = (t) =>
          t.get(Wx).getOrCreateStandaloneInjector(n);
      }
      function yv(n, t, e, r, i, o) {
        const s = t + e;
        return ot(n, s, i)
          ? (function En(n, t, e) {
              return (n[t] = e);
            })(n, s + 1, o ? r.call(o, i) : r(i))
          : (function ls(n, t) {
              const e = n[t];
              return e === j ? void 0 : e;
            })(n, s + 1);
      }
      function Ev(n, t, e) {
        const r = n + 22,
          i = C(),
          o = (function gi(n, t) {
            return n[t];
          })(i, r);
        return (function us(n, t) {
          return n[1].data[t].pure;
        })(i, r)
          ? yv(
              i,
              (function ft() {
                const n = U.lFrame;
                let t = n.bindingRootIndex;
                return (
                  -1 === t &&
                    (t = n.bindingRootIndex = n.tView.bindingStartIndex),
                  t
                );
              })(),
              t,
              o.transform,
              e,
              o
            )
          : o.transform(e);
      }
      function zd(n) {
        return (t) => {
          setTimeout(n, void 0, t);
        };
      }
      const pe = class yR extends He {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, e, r) {
          let i = t,
            o = e || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const l = t;
            (i = l.next?.bind(l)),
              (o = l.error?.bind(l)),
              (s = l.complete?.bind(l));
          }
          this.__isAsync && ((o = zd(o)), i && (i = zd(i)), s && (s = zd(s)));
          const a = super.subscribe({ next: i, error: o, complete: s });
          return t instanceof Se && t.add(a), a;
        }
      };
      function _R() {
        return this._results[Lr()]();
      }
      class Gd {
        constructor(t = !1) {
          (this._emitDistinctChangesOnly = t),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const e = Lr(),
            r = Gd.prototype;
          r[e] || (r[e] = _R);
        }
        get changes() {
          return this._changes || (this._changes = new pe());
        }
        get(t) {
          return this._results[t];
        }
        map(t) {
          return this._results.map(t);
        }
        filter(t) {
          return this._results.filter(t);
        }
        find(t) {
          return this._results.find(t);
        }
        reduce(t, e) {
          return this._results.reduce(t, e);
        }
        forEach(t) {
          this._results.forEach(t);
        }
        some(t) {
          return this._results.some(t);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(t, e) {
          const r = this;
          r.dirty = !1;
          const i = (function $t(n) {
            return n.flat(Number.POSITIVE_INFINITY);
          })(t);
          (this._changesDetected = !(function SA(n, t, e) {
            if (n.length !== t.length) return !1;
            for (let r = 0; r < n.length; r++) {
              let i = n[r],
                o = t[r];
              if ((e && ((i = e(i)), (o = e(o))), o !== i)) return !1;
            }
            return !0;
          })(r._results, i, e)) &&
            ((r._results = i),
            (r.length = i.length),
            (r.last = i[this.length - 1]),
            (r.first = i[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      let $n = (() => {
        class n {}
        return (n.__NG_ELEMENT_ID__ = CR), n;
      })();
      const vR = $n,
        bR = class extends vR {
          constructor(t, e, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = e),
              (this.elementRef = r);
          }
          createEmbeddedView(t, e) {
            const r = this._declarationTContainer.tViews,
              i = $a(
                this._declarationLView,
                r,
                t,
                16,
                null,
                r.declTNode,
                null,
                null,
                null,
                null,
                e || null
              );
            i[17] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[19];
            return (
              null !== s && (i[19] = s.createEmbeddedView(r)),
              md(r, i, t),
              new Ko(i)
            );
          }
        };
      function CR() {
        return ol(Ze(), C());
      }
      function ol(n, t) {
        return 4 & n.type ? new bR(t, n, Fi(n, t)) : null;
      }
      let dn = (() => {
        class n {}
        return (n.__NG_ELEMENT_ID__ = DR), n;
      })();
      function DR() {
        return Sv(Ze(), C());
      }
      const ER = dn,
        wv = class extends ER {
          constructor(t, e, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = e),
              (this._hostLView = r);
          }
          get element() {
            return Fi(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new vi(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = Dc(this._hostTNode, this._hostLView);
            if (Sm(t)) {
              const e = wa(t, this._hostLView),
                r = Ea(t);
              return new vi(e[1].data[r + 8], e);
            }
            return new vi(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const e = Mv(this._lContainer);
            return (null !== e && e[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, e, r) {
            let i, o;
            "number" == typeof r
              ? (i = r)
              : null != r && ((i = r.index), (o = r.injector));
            const s = t.createEmbeddedView(e || {}, o);
            return this.insert(s, i), s;
          }
          createComponent(t, e, r, i, o) {
            const s =
              t &&
              !(function Po(n) {
                return "function" == typeof n;
              })(t);
            let a;
            if (s) a = e;
            else {
              const d = e || {};
              (a = d.index),
                (r = d.injector),
                (i = d.projectableNodes),
                (o = d.environmentInjector || d.ngModuleRef);
            }
            const l = s ? t : new Qo(he(t)),
              u = r || this.parentInjector;
            if (!o && null == l.ngModule) {
              const h = (s ? u : this.parentInjector).get(Bn, null);
              h && (o = h);
            }
            const c = l.create(u, i, void 0, o);
            return this.insert(c.hostView, a), c;
          }
          insert(t, e) {
            const r = t._lView,
              i = r[1];
            if (
              (function KS(n) {
                return rn(n[3]);
              })(r)
            ) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  h = new wv(d, d[6], d[3]);
                h.detach(h.indexOf(t));
              }
            }
            const o = this._adjustIndex(e),
              s = this._lContainer;
            !(function m0(n, t, e, r) {
              const i = 10 + r,
                o = e.length;
              r > 0 && (e[i - 1][4] = t),
                r < o - 10
                  ? ((t[4] = e[i]), Vm(e, 10 + r, t))
                  : (e.push(t), (t[4] = null)),
                (t[3] = e);
              const s = t[17];
              null !== s &&
                e !== s &&
                (function g0(n, t) {
                  const e = n[9];
                  t[16] !== t[3][3][16] && (n[2] = !0),
                    null === e ? (n[9] = [t]) : e.push(t);
                })(s, t);
              const a = t[19];
              null !== a && a.insertView(n), (t[2] |= 64);
            })(i, r, s, o);
            const a = Gc(o, s),
              l = r[G],
              u = Ra(l, s[7]);
            return (
              null !== u &&
                (function h0(n, t, e, r, i, o) {
                  (r[0] = i), (r[6] = t), jo(n, r, e, 1, i, o);
                })(i, s[6], l, r, u, a),
              t.attachToViewContainerRef(),
              Vm(qd(s), o, t),
              t
            );
          }
          move(t, e) {
            return this.insert(t, e);
          }
          indexOf(t) {
            const e = Mv(this._lContainer);
            return null !== e ? e.indexOf(t) : -1;
          }
          remove(t) {
            const e = this._adjustIndex(t, -1),
              r = jc(this._lContainer, e);
            r && (Ia(qd(this._lContainer), e), lg(r[1], r));
          }
          detach(t) {
            const e = this._adjustIndex(t, -1),
              r = jc(this._lContainer, e);
            return r && null != Ia(qd(this._lContainer), e) ? new Ko(r) : null;
          }
          _adjustIndex(t, e = 0) {
            return t ?? this.length + e;
          }
        };
      function Mv(n) {
        return n[8];
      }
      function qd(n) {
        return n[8] || (n[8] = []);
      }
      function Sv(n, t) {
        let e;
        const r = t[n.index];
        if (rn(r)) e = r;
        else {
          let i;
          if (8 & n.type) i = Ye(r);
          else {
            const o = t[G];
            i = o.createComment("");
            const s = Tt(n, t);
            Nr(
              o,
              Ra(o, s),
              i,
              (function b0(n, t) {
                return n.nextSibling(t);
              })(o, s),
              !1
            );
          }
          (t[n.index] = e = by(r, t, i, n)), Ga(t, e);
        }
        return new wv(e, n, t);
      }
      class Wd {
        constructor(t) {
          (this.queryList = t), (this.matches = null);
        }
        clone() {
          return new Wd(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class Kd {
        constructor(t = []) {
          this.queries = t;
        }
        createEmbeddedView(t) {
          const e = t.queries;
          if (null !== e) {
            const r =
                null !== t.contentQueries ? t.contentQueries[0] : e.length,
              i = [];
            for (let o = 0; o < r; o++) {
              const s = e.getByIndex(o);
              i.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new Kd(i);
          }
          return null;
        }
        insertView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        detachView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        dirtyQueriesWithMatches(t) {
          for (let e = 0; e < this.queries.length; e++)
            null !== xv(t, e).matches && this.queries[e].setDirty();
        }
      }
      class Av {
        constructor(t, e, r = null) {
          (this.predicate = t), (this.flags = e), (this.read = r);
        }
      }
      class Qd {
        constructor(t = []) {
          this.queries = t;
        }
        elementStart(t, e) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(t, e);
        }
        elementEnd(t) {
          for (let e = 0; e < this.queries.length; e++)
            this.queries[e].elementEnd(t);
        }
        embeddedTView(t) {
          let e = null;
          for (let r = 0; r < this.length; r++) {
            const i = null !== e ? e.length : 0,
              o = this.getByIndex(r).embeddedTView(t, i);
            o &&
              ((o.indexInDeclarationView = r),
              null !== e ? e.push(o) : (e = [o]));
          }
          return null !== e ? new Qd(e) : null;
        }
        template(t, e) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(t, e);
        }
        getByIndex(t) {
          return this.queries[t];
        }
        get length() {
          return this.queries.length;
        }
        track(t) {
          this.queries.push(t);
        }
      }
      class Yd {
        constructor(t, e = -1) {
          (this.metadata = t),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = e);
        }
        elementStart(t, e) {
          this.isApplyingToNode(e) && this.matchTNode(t, e);
        }
        elementEnd(t) {
          this._declarationNodeIndex === t.index &&
            (this._appliesToNextNode = !1);
        }
        template(t, e) {
          this.elementStart(t, e);
        }
        embeddedTView(t, e) {
          return this.isApplyingToNode(t)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-t.index, e),
              new Yd(this.metadata))
            : null;
        }
        isApplyingToNode(t) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const e = this._declarationNodeIndex;
            let r = t.parent;
            for (; null !== r && 8 & r.type && r.index !== e; ) r = r.parent;
            return e === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(t, e) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let i = 0; i < r.length; i++) {
              const o = r[i];
              this.matchTNodeWithReadOption(t, e, wR(e, o)),
                this.matchTNodeWithReadOption(t, e, Aa(e, t, o, !1, !1));
            }
          else
            r === $n
              ? 4 & e.type && this.matchTNodeWithReadOption(t, e, -1)
              : this.matchTNodeWithReadOption(t, e, Aa(e, t, r, !1, !1));
        }
        matchTNodeWithReadOption(t, e, r) {
          if (null !== r) {
            const i = this.metadata.read;
            if (null !== i)
              if (i === fe || i === dn || (i === $n && 4 & e.type))
                this.addMatch(e.index, -2);
              else {
                const o = Aa(e, t, i, !1, !1);
                null !== o && this.addMatch(e.index, o);
              }
            else this.addMatch(e.index, r);
          }
        }
        addMatch(t, e) {
          null === this.matches
            ? (this.matches = [t, e])
            : this.matches.push(t, e);
        }
      }
      function wR(n, t) {
        const e = n.localNames;
        if (null !== e)
          for (let r = 0; r < e.length; r += 2) if (e[r] === t) return e[r + 1];
        return null;
      }
      function SR(n, t, e, r) {
        return -1 === e
          ? (function MR(n, t) {
              return 11 & n.type ? Fi(n, t) : 4 & n.type ? ol(n, t) : null;
            })(t, n)
          : -2 === e
          ? (function AR(n, t, e) {
              return e === fe
                ? Fi(t, n)
                : e === $n
                ? ol(t, n)
                : e === dn
                ? Sv(t, n)
                : void 0;
            })(n, t, r)
          : xr(n, n[1], e, t);
      }
      function Iv(n, t, e, r) {
        const i = t[19].queries[r];
        if (null === i.matches) {
          const o = n.data,
            s = e.matches,
            a = [];
          for (let l = 0; l < s.length; l += 2) {
            const u = s[l];
            a.push(u < 0 ? null : SR(t, o[u], s[l + 1], e.metadata.read));
          }
          i.matches = a;
        }
        return i.matches;
      }
      function Zd(n, t, e, r) {
        const i = n.queries.getByIndex(e),
          o = i.matches;
        if (null !== o) {
          const s = Iv(n, t, i, e);
          for (let a = 0; a < o.length; a += 2) {
            const l = o[a];
            if (l > 0) r.push(s[a / 2]);
            else {
              const u = o[a + 1],
                c = t[-l];
              for (let d = 10; d < c.length; d++) {
                const h = c[d];
                h[17] === h[3] && Zd(h[1], h, u, r);
              }
              if (null !== c[9]) {
                const d = c[9];
                for (let h = 0; h < d.length; h++) {
                  const f = d[h];
                  Zd(f[1], f, u, r);
                }
              }
            }
          }
        }
        return r;
      }
      function st(n) {
        const t = C(),
          e = ee(),
          r = gm();
        pc(r + 1);
        const i = xv(e, r);
        if (
          n.dirty &&
          (function WS(n) {
            return 4 == (4 & n[2]);
          })(t) ===
            (2 == (2 & i.metadata.flags))
        ) {
          if (null === i.matches) n.reset([]);
          else {
            const o = i.crossesNgTemplate ? Zd(e, t, r, []) : Iv(e, t, i, r);
            n.reset(o, pI), n.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function Wi(n, t, e) {
        const r = ee();
        r.firstCreatePass &&
          (Fv(r, new Av(n, t, e), -1),
          2 == (2 & t) && (r.staticViewQueries = !0)),
          Tv(r, C(), t);
      }
      function hn(n, t, e, r) {
        const i = ee();
        if (i.firstCreatePass) {
          const o = Ze();
          Fv(i, new Av(t, e, r), o.index),
            (function TR(n, t) {
              const e = n.contentQueries || (n.contentQueries = []);
              t !== (e.length ? e[e.length - 1] : -1) &&
                e.push(n.queries.length - 1, t);
            })(i, n),
            2 == (2 & e) && (i.staticContentQueries = !0);
        }
        Tv(i, C(), e);
      }
      function at() {
        return (function IR(n, t) {
          return n[19].queries[t].queryList;
        })(C(), gm());
      }
      function Tv(n, t, e) {
        const r = new Gd(4 == (4 & e));
        py(n, t, r, r.destroy),
          null === t[19] && (t[19] = new Kd()),
          t[19].queries.push(new Wd(r));
      }
      function Fv(n, t, e) {
        null === n.queries && (n.queries = new Qd()),
          n.queries.track(new Yd(t, e));
      }
      function xv(n, t) {
        return n.queries.getByIndex(t);
      }
      function al(...n) {}
      const ll = new w("Application Initializer");
      let ul = (() => {
        class n {
          constructor(e) {
            (this.appInits = e),
              (this.resolve = al),
              (this.reject = al),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, i) => {
                (this.resolve = r), (this.reject = i);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const e = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let i = 0; i < this.appInits.length; i++) {
                const o = this.appInits[i]();
                if (es(o)) e.push(o);
                else if (Fd(o)) {
                  const s = new Promise((a, l) => {
                    o.subscribe({ complete: a, error: l });
                  });
                  e.push(s);
                }
              }
            Promise.all(e)
              .then(() => {
                r();
              })
              .catch((i) => {
                this.reject(i);
              }),
              0 === e.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(ll, 8));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const ds = new w("AppId", {
        providedIn: "root",
        factory: function Yv() {
          return `${nh()}${nh()}${nh()}`;
        },
      });
      function nh() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Zv = new w("Platform Initializer"),
        cl = new w("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        Xv = new w("appBootstrapListener"),
        cr = new w("AnimationModuleType");
      let YR = (() => {
        class n {
          log(e) {
            console.log(e);
          }
          warn(e) {
            console.warn(e);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "platform" })),
          n
        );
      })();
      const An = new w("LocaleId", {
        providedIn: "root",
        factory: () =>
          Y(An, P.Optional | P.SkipSelf) ||
          (function ZR() {
            return (typeof $localize < "u" && $localize.locale) || Gi;
          })(),
      });
      class JR {
        constructor(t, e) {
          (this.ngModuleFactory = t), (this.componentFactories = e);
        }
      }
      let Jv = (() => {
        class n {
          compileModuleSync(e) {
            return new jd(e);
          }
          compileModuleAsync(e) {
            return Promise.resolve(this.compileModuleSync(e));
          }
          compileModuleAndAllComponentsSync(e) {
            const r = this.compileModuleSync(e),
              o = Un(At(e).declarations).reduce((s, a) => {
                const l = he(a);
                return l && s.push(new Qo(l)), s;
              }, []);
            return new JR(r, o);
          }
          compileModuleAndAllComponentsAsync(e) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(e));
          }
          clearCache() {}
          clearCacheFor(e) {}
          getModuleId(e) {}
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const nN = (() => Promise.resolve(0))();
      function rh(n) {
        typeof Zone > "u"
          ? nN.then(() => {
              n && n.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", n);
      }
      class K {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: e = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new pe(!1)),
            (this.onMicrotaskEmpty = new pe(!1)),
            (this.onStable = new pe(!1)),
            (this.onError = new pe(!1)),
            typeof Zone > "u")
          )
            throw new b(908, !1);
          Zone.assertZonePatched();
          const i = this;
          (i._nesting = 0),
            (i._outer = i._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !r && e),
            (i.shouldCoalesceRunChangeDetection = r),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function rN() {
              let n = De.requestAnimationFrame,
                t = De.cancelAnimationFrame;
              if (typeof Zone < "u" && n && t) {
                const e = n[Zone.__symbol__("OriginalDelegate")];
                e && (n = e);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: n,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function sN(n) {
              const t = () => {
                !(function oN(n) {
                  n.isCheckStableRunning ||
                    -1 !== n.lastRequestAnimationFrameId ||
                    ((n.lastRequestAnimationFrameId =
                      n.nativeRequestAnimationFrame.call(De, () => {
                        n.fakeTopEventTask ||
                          (n.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (n.lastRequestAnimationFrameId = -1),
                                oh(n),
                                (n.isCheckStableRunning = !0),
                                ih(n),
                                (n.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          n.fakeTopEventTask.invoke();
                      })),
                    oh(n));
                })(n);
              };
              n._inner = n._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (e, r, i, o, s, a) => {
                  try {
                    return nb(n), e.invokeTask(i, o, s, a);
                  } finally {
                    ((n.shouldCoalesceEventChangeDetection &&
                      "eventTask" === o.type) ||
                      n.shouldCoalesceRunChangeDetection) &&
                      t(),
                      rb(n);
                  }
                },
                onInvoke: (e, r, i, o, s, a, l) => {
                  try {
                    return nb(n), e.invoke(i, o, s, a, l);
                  } finally {
                    n.shouldCoalesceRunChangeDetection && t(), rb(n);
                  }
                },
                onHasTask: (e, r, i, o) => {
                  e.hasTask(i, o),
                    r === i &&
                      ("microTask" == o.change
                        ? ((n._hasPendingMicrotasks = o.microTask),
                          oh(n),
                          ih(n))
                        : "macroTask" == o.change &&
                          (n.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (e, r, i, o) => (
                  e.handleError(i, o),
                  n.runOutsideAngular(() => n.onError.emit(o)),
                  !1
                ),
              });
            })(i);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!K.isInAngularZone()) throw new b(909, !1);
        }
        static assertNotInAngularZone() {
          if (K.isInAngularZone()) throw new b(909, !1);
        }
        run(t, e, r) {
          return this._inner.run(t, e, r);
        }
        runTask(t, e, r, i) {
          const o = this._inner,
            s = o.scheduleEventTask("NgZoneEvent: " + i, t, iN, al, al);
          try {
            return o.runTask(s, e, r);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(t, e, r) {
          return this._inner.runGuarded(t, e, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const iN = {};
      function ih(n) {
        if (0 == n._nesting && !n.hasPendingMicrotasks && !n.isStable)
          try {
            n._nesting++, n.onMicrotaskEmpty.emit(null);
          } finally {
            if ((n._nesting--, !n.hasPendingMicrotasks))
              try {
                n.runOutsideAngular(() => n.onStable.emit(null));
              } finally {
                n.isStable = !0;
              }
          }
      }
      function oh(n) {
        n.hasPendingMicrotasks = !!(
          n._hasPendingMicrotasks ||
          ((n.shouldCoalesceEventChangeDetection ||
            n.shouldCoalesceRunChangeDetection) &&
            -1 !== n.lastRequestAnimationFrameId)
        );
      }
      function nb(n) {
        n._nesting++,
          n.isStable && ((n.isStable = !1), n.onUnstable.emit(null));
      }
      function rb(n) {
        n._nesting--, ih(n);
      }
      class aN {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new pe()),
            (this.onMicrotaskEmpty = new pe()),
            (this.onStable = new pe()),
            (this.onError = new pe());
        }
        run(t, e, r) {
          return t.apply(e, r);
        }
        runGuarded(t, e, r) {
          return t.apply(e, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, e, r, i) {
          return t.apply(e, r);
        }
      }
      const ib = new w(""),
        dl = new w("");
      let lh,
        sh = (() => {
          class n {
            constructor(e, r, i) {
              (this._ngZone = e),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                lh ||
                  ((function lN(n) {
                    lh = n;
                  })(i),
                  i.addToWindow(r)),
                this._watchAngularEvents(),
                e.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      K.assertNotInAngularZone(),
                        rh(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                rh(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let e = this._callbacks.pop();
                    clearTimeout(e.timeoutId), e.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let e = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(e) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((e) => ({
                    source: e.source,
                    creationLocation: e.creationLocation,
                    data: e.data,
                  }))
                : [];
            }
            addCallback(e, r, i) {
              let o = -1;
              r &&
                r > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== o
                  )),
                    e(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: e, timeoutId: o, updateCb: i });
            }
            whenStable(e, r, i) {
              if (i && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(e, r, i), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(e) {
              this.registry.registerApplication(e, this);
            }
            unregisterApplication(e) {
              this.registry.unregisterApplication(e);
            }
            findProviders(e, r, i) {
              return [];
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(K), v(ah), v(dl));
            }),
            (n.ɵprov = I({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        ah = (() => {
          class n {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(e, r) {
              this._applications.set(e, r);
            }
            unregisterApplication(e) {
              this._applications.delete(e);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(e) {
              return this._applications.get(e) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(e, r = !0) {
              return lh?.findTestabilityInTree(this, e, r) ?? null;
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = I({
              token: n,
              factory: n.ɵfac,
              providedIn: "platform",
            })),
            n
          );
        })(),
        dr = null;
      const ob = new w("AllowMultipleToken"),
        uh = new w("PlatformDestroyListeners");
      class sb {
        constructor(t, e) {
          (this.name = t), (this.token = e);
        }
      }
      function lb(n, t, e = []) {
        const r = `Platform: ${t}`,
          i = new w(r);
        return (o = []) => {
          let s = ch();
          if (!s || s.injector.get(ob, !1)) {
            const a = [...e, ...o, { provide: i, useValue: !0 }];
            n
              ? n(a)
              : (function dN(n) {
                  if (dr && !dr.get(ob, !1)) throw new b(400, !1);
                  dr = n;
                  const t = n.get(cb);
                  (function ab(n) {
                    const t = n.get(Zv, null);
                    t && t.forEach((e) => e());
                  })(n);
                })(
                  (function ub(n = [], t) {
                    return zt.create({
                      name: t,
                      providers: [
                        { provide: rd, useValue: "platform" },
                        { provide: uh, useValue: new Set([() => (dr = null)]) },
                        ...n,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function fN(n) {
            const t = ch();
            if (!t) throw new b(401, !1);
            return t;
          })();
        };
      }
      function ch() {
        return dr?.get(cb) ?? null;
      }
      let cb = (() => {
        class n {
          constructor(e) {
            (this._injector = e),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(e, r) {
            const i = (function hb(n, t) {
                let e;
                return (
                  (e =
                    "noop" === n
                      ? new aN()
                      : ("zone.js" === n ? void 0 : n) || new K(t)),
                  e
                );
              })(
                r?.ngZone,
                (function db(n) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!n || !n.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!n || !n.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              o = [{ provide: K, useValue: i }];
            return i.run(() => {
              const s = zt.create({
                  providers: o,
                  parent: this.injector,
                  name: e.moduleType.name,
                }),
                a = e.create(s),
                l = a.injector.get(Cn, null);
              if (!l) throw new b(402, !1);
              return (
                i.runOutsideAngular(() => {
                  const u = i.onError.subscribe({
                    next: (c) => {
                      l.handleError(c);
                    },
                  });
                  a.onDestroy(() => {
                    hl(this._modules, a), u.unsubscribe();
                  });
                }),
                (function fb(n, t, e) {
                  try {
                    const r = e();
                    return es(r)
                      ? r.catch((i) => {
                          throw (
                            (t.runOutsideAngular(() => n.handleError(i)), i)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => n.handleError(r)), r);
                  }
                })(l, i, () => {
                  const u = a.injector.get(ul);
                  return (
                    u.runInitializers(),
                    u.donePromise.then(
                      () => (
                        (function L_(n) {
                          Ht(n, "Expected localeId to be defined"),
                            "string" == typeof n &&
                              (P_ = n.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(An, Gi) || Gi),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(e, r = []) {
            const i = pb({}, r);
            return (function uN(n, t, e) {
              const r = new jd(e);
              return Promise.resolve(r);
            })(0, 0, e).then((o) => this.bootstrapModuleFactory(o, i));
          }
          _moduleDoBootstrap(e) {
            const r = e.injector.get(hs);
            if (e._bootstrapComponents.length > 0)
              e._bootstrapComponents.forEach((i) => r.bootstrap(i));
            else {
              if (!e.instance.ngDoBootstrap) throw new b(403, !1);
              e.instance.ngDoBootstrap(r);
            }
            this._modules.push(e);
          }
          onDestroy(e) {
            this._destroyListeners.push(e);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new b(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const e = this._injector.get(uh, null);
            e && (e.forEach((r) => r()), e.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(zt));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "platform" })),
          n
        );
      })();
      function pb(n, t) {
        return Array.isArray(t) ? t.reduce(pb, n) : { ...n, ...t };
      }
      let hs = (() => {
        class n {
          constructor(e, r, i) {
            (this._zone = e),
              (this._injector = r),
              (this._exceptionHandler = i),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const o = new we((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new we((a) => {
                let l;
                this._zone.runOutsideAngular(() => {
                  l = this._zone.onStable.subscribe(() => {
                    K.assertNotInAngularZone(),
                      rh(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const u = this._zone.onUnstable.subscribe(() => {
                  K.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  l.unsubscribe(), u.unsubscribe();
                };
              });
            this.isStable = Vp(
              o,
              s.pipe(
                (function Bp() {
                  return (n) =>
                    ia()(
                      (function fS(n, t) {
                        return function (r) {
                          let i;
                          if (
                            ((i =
                              "function" == typeof n
                                ? n
                                : function () {
                                    return n;
                                  }),
                            "function" == typeof t)
                          )
                            return r.lift(new pS(i, t));
                          const o = Object.create(r, cS);
                          return (o.source = r), (o.subjectFactory = i), o;
                        };
                      })(mS)(n)
                    );
                })()
              )
            );
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(e, r) {
            const i = e instanceof zg;
            if (!this._injector.get(ul).done)
              throw (
                (!i &&
                  (function di(n) {
                    const t = he(n) || tt(n) || dt(n);
                    return null !== t && t.standalone;
                  })(e),
                new b(405, false))
              );
            let s;
            (s = i ? e : this._injector.get(Go).resolveComponentFactory(e)),
              this.componentTypes.push(s.componentType);
            const a = (function cN(n) {
                return n.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(qi),
              u = s.create(zt.NULL, [], r || s.selector, a),
              c = u.location.nativeElement,
              d = u.injector.get(ib, null);
            return (
              d?.registerApplication(c),
              u.onDestroy(() => {
                this.detachView(u.hostView),
                  hl(this.components, u),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(u),
              u
            );
          }
          tick() {
            if (this._runningTick) throw new b(101, !1);
            try {
              this._runningTick = !0;
              for (let e of this._views) e.detectChanges();
            } catch (e) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(e)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(e) {
            const r = e;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(e) {
            const r = e;
            hl(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(e) {
            this.attachView(e.hostView), this.tick(), this.components.push(e);
            const r = this._injector.get(Xv, []);
            r.push(...this._bootstrapListeners), r.forEach((i) => i(e));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((e) => e()),
                  this._views.slice().forEach((e) => e.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(e) {
            return (
              this._destroyListeners.push(e),
              () => hl(this._destroyListeners, e)
            );
          }
          destroy() {
            if (this._destroyed) throw new b(406, !1);
            const e = this._injector;
            e.destroy && !e.destroyed && e.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(K), v(Bn), v(Cn));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function hl(n, t) {
        const e = n.indexOf(t);
        e > -1 && n.splice(e, 1);
      }
      let jr = (() => {
        class n {}
        return (n.__NG_ELEMENT_ID__ = gN), n;
      })();
      function gN(n) {
        return (function yN(n, t, e) {
          if (xo(n) && !e) {
            const r = Ft(n.index, t);
            return new Ko(r, r);
          }
          return 47 & n.type ? new Ko(t[16], t) : null;
        })(Ze(), C(), 16 == (16 & n));
      }
      const FN = lb(null, "core", []);
      let xN = (() => {
          class n {
            constructor(e) {}
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(hs));
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({})),
            n
          );
        })(),
        mh = null;
      function In() {
        return mh;
      }
      class kN {}
      const J = new w("DocumentToken");
      let gh = (() => {
        class n {
          historyGo(e) {
            throw new Error("Not implemented");
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = I({
            token: n,
            factory: function () {
              return (function ON() {
                return v(Mb);
              })();
            },
            providedIn: "platform",
          })),
          n
        );
      })();
      const PN = new w("Location Initialized");
      let Mb = (() => {
        class n extends gh {
          constructor(e) {
            super(), (this._doc = e), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return In().getBaseHref(this._doc);
          }
          onPopState(e) {
            const r = In().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", e, !1),
              () => r.removeEventListener("popstate", e)
            );
          }
          onHashChange(e) {
            const r = In().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", e, !1),
              () => r.removeEventListener("hashchange", e)
            );
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(e) {
            this.location.pathname = e;
          }
          pushState(e, r, i) {
            Sb() ? this._history.pushState(e, r, i) : (this.location.hash = i);
          }
          replaceState(e, r, i) {
            Sb()
              ? this._history.replaceState(e, r, i)
              : (this.location.hash = i);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(e = 0) {
            this._history.go(e);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(J));
          }),
          (n.ɵprov = I({
            token: n,
            factory: function () {
              return (function LN() {
                return new Mb(v(J));
              })();
            },
            providedIn: "platform",
          })),
          n
        );
      })();
      function Sb() {
        return !!window.history.pushState;
      }
      function yh(n, t) {
        if (0 == n.length) return t;
        if (0 == t.length) return n;
        let e = 0;
        return (
          n.endsWith("/") && e++,
          t.startsWith("/") && e++,
          2 == e ? n + t.substring(1) : 1 == e ? n + t : n + "/" + t
        );
      }
      function Ab(n) {
        const t = n.match(/#|\?|$/),
          e = (t && t.index) || n.length;
        return n.slice(0, e - ("/" === n[e - 1] ? 1 : 0)) + n.slice(e);
      }
      function Gn(n) {
        return n && "?" !== n[0] ? "?" + n : n;
      }
      let zr = (() => {
        class n {
          historyGo(e) {
            throw new Error("Not implemented");
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = I({
            token: n,
            factory: function () {
              return Y(Tb);
            },
            providedIn: "root",
          })),
          n
        );
      })();
      const Ib = new w("appBaseHref");
      let Tb = (() => {
          class n extends zr {
            constructor(e, r) {
              super(),
                (this._platformLocation = e),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  Y(J).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(e) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(e),
                this._platformLocation.onHashChange(e)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(e) {
              return yh(this._baseHref, e);
            }
            path(e = !1) {
              const r =
                  this._platformLocation.pathname +
                  Gn(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && e ? `${r}${i}` : r;
            }
            pushState(e, r, i, o) {
              const s = this.prepareExternalUrl(i + Gn(o));
              this._platformLocation.pushState(e, r, s);
            }
            replaceState(e, r, i, o) {
              const s = this.prepareExternalUrl(i + Gn(o));
              this._platformLocation.replaceState(e, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(e = 0) {
              this._platformLocation.historyGo?.(e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(gh), v(Ib, 8));
            }),
            (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        VN = (() => {
          class n extends zr {
            constructor(e, r) {
              super(),
                (this._platformLocation = e),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(e) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(e),
                this._platformLocation.onHashChange(e)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(e = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(e) {
              const r = yh(this._baseHref, e);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(e, r, i, o) {
              let s = this.prepareExternalUrl(i + Gn(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(e, r, s);
            }
            replaceState(e, r, i, o) {
              let s = this.prepareExternalUrl(i + Gn(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(e, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(e = 0) {
              this._platformLocation.historyGo?.(e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(gh), v(Ib, 8));
            }),
            (n.ɵprov = I({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        _h = (() => {
          class n {
            constructor(e) {
              (this._subject = new pe()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = e);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function UN(n) {
                if (new RegExp("^(https?:)?//").test(n)) {
                  const [, e] = n.split(/\/\/[^\/]+/);
                  return e;
                }
                return n;
              })(Ab(Fb(r)))),
                this._locationStrategy.onPopState((i) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: i.state,
                    type: i.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(e = !1) {
              return this.normalize(this._locationStrategy.path(e));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(e, r = "") {
              return this.path() == this.normalize(e + Gn(r));
            }
            normalize(e) {
              return n.stripTrailingSlash(
                (function HN(n, t) {
                  return n && t.startsWith(n) ? t.substring(n.length) : t;
                })(this._basePath, Fb(e))
              );
            }
            prepareExternalUrl(e) {
              return (
                e && "/" !== e[0] && (e = "/" + e),
                this._locationStrategy.prepareExternalUrl(e)
              );
            }
            go(e, r = "", i = null) {
              this._locationStrategy.pushState(i, "", e, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(e + Gn(r)),
                  i
                );
            }
            replaceState(e, r = "", i = null) {
              this._locationStrategy.replaceState(i, "", e, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(e + Gn(r)),
                  i
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(e = 0) {
              this._locationStrategy.historyGo?.(e);
            }
            onUrlChange(e) {
              return (
                this._urlChangeListeners.push(e),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(e);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(e = "", r) {
              this._urlChangeListeners.forEach((i) => i(e, r));
            }
            subscribe(e, r, i) {
              return this._subject.subscribe({
                next: e,
                error: r,
                complete: i,
              });
            }
          }
          return (
            (n.normalizeQueryParams = Gn),
            (n.joinWithSlash = yh),
            (n.stripTrailingSlash = Ab),
            (n.ɵfac = function (e) {
              return new (e || n)(v(zr));
            }),
            (n.ɵprov = I({
              token: n,
              factory: function () {
                return (function BN() {
                  return new _h(v(zr));
                })();
              },
              providedIn: "root",
            })),
            n
          );
        })();
      function Fb(n) {
        return n.replace(/\/index.html$/, "");
      }
      let Ml = (() => {
        class n {
          constructor(e, r) {
            (this._viewContainer = e),
              (this._context = new Fk()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(e) {
            (this._context.$implicit = this._context.ngIf = e),
              this._updateView();
          }
          set ngIfThen(e) {
            jb("ngIfThen", e),
              (this._thenTemplateRef = e),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(e) {
            jb("ngIfElse", e),
              (this._elseTemplateRef = e),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(e, r) {
            return !0;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(g(dn), g($n));
          }),
          (n.ɵdir = M({
            type: n,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          n
        );
      })();
      class Fk {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function jb(n, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${n} must be a TemplateRef, but received '${be(t)}'.`
          );
      }
      class Ih {
        constructor(t, e) {
          (this._viewContainerRef = t),
            (this._templateRef = e),
            (this._created = !1);
        }
        create() {
          (this._created = !0),
            this._viewContainerRef.createEmbeddedView(this._templateRef);
        }
        destroy() {
          (this._created = !1), this._viewContainerRef.clear();
        }
        enforceState(t) {
          t && !this._created
            ? this.create()
            : !t && this._created && this.destroy();
        }
      }
      let Sl = (() => {
          class n {
            constructor() {
              (this._defaultUsed = !1),
                (this._caseCount = 0),
                (this._lastCaseCheckIndex = 0),
                (this._lastCasesMatched = !1);
            }
            set ngSwitch(e) {
              (this._ngSwitch = e),
                0 === this._caseCount && this._updateDefaultCases(!0);
            }
            _addCase() {
              return this._caseCount++;
            }
            _addDefault(e) {
              this._defaultViews || (this._defaultViews = []),
                this._defaultViews.push(e);
            }
            _matchCase(e) {
              const r = e == this._ngSwitch;
              return (
                (this._lastCasesMatched = this._lastCasesMatched || r),
                this._lastCaseCheckIndex++,
                this._lastCaseCheckIndex === this._caseCount &&
                  (this._updateDefaultCases(!this._lastCasesMatched),
                  (this._lastCaseCheckIndex = 0),
                  (this._lastCasesMatched = !1)),
                r
              );
            }
            _updateDefaultCases(e) {
              if (this._defaultViews && e !== this._defaultUsed) {
                this._defaultUsed = e;
                for (let r = 0; r < this._defaultViews.length; r++)
                  this._defaultViews[r].enforceState(e);
              }
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵdir = M({
              type: n,
              selectors: [["", "ngSwitch", ""]],
              inputs: { ngSwitch: "ngSwitch" },
              standalone: !0,
            })),
            n
          );
        })(),
        $b = (() => {
          class n {
            constructor(e, r, i) {
              (this.ngSwitch = i), i._addCase(), (this._view = new Ih(e, r));
            }
            ngDoCheck() {
              this._view.enforceState(
                this.ngSwitch._matchCase(this.ngSwitchCase)
              );
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(g(dn), g($n), g(Sl, 9));
            }),
            (n.ɵdir = M({
              type: n,
              selectors: [["", "ngSwitchCase", ""]],
              inputs: { ngSwitchCase: "ngSwitchCase" },
              standalone: !0,
            })),
            n
          );
        })();
      let Gb = (() => {
          class n {
            transform(e) {
              if (null == e) return null;
              if ("string" != typeof e)
                throw (function mn(n, t) {
                  return new b(2100, !1);
                })();
              return e.toUpperCase();
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵpipe = Ct({
              name: "uppercase",
              type: n,
              pure: !0,
              standalone: !0,
            })),
            n
          );
        })(),
        xh = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({})),
            n
          );
        })();
      const Wb = "browser";
      let aO = (() => {
        class n {}
        return (
          (n.ɵprov = I({
            token: n,
            providedIn: "root",
            factory: () => new lO(v(J), window),
          })),
          n
        );
      })();
      class lO {
        constructor(t, e) {
          (this.document = t), (this.window = e), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const e = (function uO(n, t) {
            const e = n.getElementById(t) || n.getElementsByName(t)[0];
            if (e) return e;
            if (
              "function" == typeof n.createTreeWalker &&
              n.body &&
              (n.body.createShadowRoot || n.body.attachShadow)
            ) {
              const r = n.createTreeWalker(n.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i; ) {
                const o = i.shadowRoot;
                if (o) {
                  const s =
                    o.getElementById(t) || o.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                i = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          e && (this.scrollToElement(e), e.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const e = this.window.history;
            e && e.scrollRestoration && (e.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const e = t.getBoundingClientRect(),
            r = e.left + this.window.pageXOffset,
            i = e.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(r - o[0], i - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              Kb(this.window.history) ||
              Kb(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function Kb(n) {
        return Object.getOwnPropertyDescriptor(n, "scrollRestoration");
      }
      class LO extends kN {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class kh extends LO {
        static makeCurrent() {
          !(function NN(n) {
            mh || (mh = n);
          })(new kh());
        }
        onAndCancel(t, e, r) {
          return (
            t.addEventListener(e, r, !1),
            () => {
              t.removeEventListener(e, r, !1);
            }
          );
        }
        dispatchEvent(t, e) {
          t.dispatchEvent(e);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, e) {
          return (e = e || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, e) {
          return "window" === e
            ? window
            : "document" === e
            ? t
            : "body" === e
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const e = (function VO() {
            return (
              (ys = ys || document.querySelector("base")),
              ys ? ys.getAttribute("href") : null
            );
          })();
          return null == e
            ? null
            : (function BO(n) {
                (Il = Il || document.createElement("a")),
                  Il.setAttribute("href", n);
                const t = Il.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(e);
        }
        resetBaseElement() {
          ys = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return (function wk(n, t) {
            t = encodeURIComponent(t);
            for (const e of n.split(";")) {
              const r = e.indexOf("="),
                [i, o] = -1 == r ? [e, ""] : [e.slice(0, r), e.slice(r + 1)];
              if (i.trim() === t) return decodeURIComponent(o);
            }
            return null;
          })(document.cookie, t);
        }
      }
      let Il,
        ys = null;
      const eC = new w("TRANSITION_ID"),
        UO = [
          {
            provide: ll,
            useFactory: function HO(n, t, e) {
              return () => {
                e.get(ul).donePromise.then(() => {
                  const r = In(),
                    i = t.querySelectorAll(`style[ng-transition="${n}"]`);
                  for (let o = 0; o < i.length; o++) r.remove(i[o]);
                });
              };
            },
            deps: [eC, J, zt],
            multi: !0,
          },
        ];
      let $O = (() => {
        class n {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const Tl = new w("EventManagerPlugins");
      let Fl = (() => {
        class n {
          constructor(e, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              e.forEach((i) => (i.manager = this)),
              (this._plugins = e.slice().reverse());
          }
          addEventListener(e, r, i) {
            return this._findPluginFor(r).addEventListener(e, r, i);
          }
          addGlobalEventListener(e, r, i) {
            return this._findPluginFor(r).addGlobalEventListener(e, r, i);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(e) {
            const r = this._eventNameToPlugin.get(e);
            if (r) return r;
            const i = this._plugins;
            for (let o = 0; o < i.length; o++) {
              const s = i[o];
              if (s.supports(e)) return this._eventNameToPlugin.set(e, s), s;
            }
            throw new Error(`No event manager plugin found for event ${e}`);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(Tl), v(K));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class tC {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, e, r) {
          const i = In().getGlobalEventTarget(this._doc, t);
          if (!i)
            throw new Error(`Unsupported event target ${i} for event ${e}`);
          return this.addEventListener(i, e, r);
        }
      }
      let nC = (() => {
          class n {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(e) {
              const r = new Set();
              e.forEach((i) => {
                this._stylesSet.has(i) || (this._stylesSet.add(i), r.add(i));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(e) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = I({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        _s = (() => {
          class n extends nC {
            constructor(e) {
              super(),
                (this._doc = e),
                (this._hostNodes = new Map()),
                this._hostNodes.set(e.head, []);
            }
            _addStylesToHost(e, r, i) {
              e.forEach((o) => {
                const s = this._doc.createElement("style");
                (s.textContent = o), i.push(r.appendChild(s));
              });
            }
            addHost(e) {
              const r = [];
              this._addStylesToHost(this._stylesSet, e, r),
                this._hostNodes.set(e, r);
            }
            removeHost(e) {
              const r = this._hostNodes.get(e);
              r && r.forEach(rC), this._hostNodes.delete(e);
            }
            onStylesAdded(e) {
              this._hostNodes.forEach((r, i) => {
                this._addStylesToHost(e, i, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((e) => e.forEach(rC));
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(J));
            }),
            (n.ɵprov = I({ token: n, factory: n.ɵfac })),
            n
          );
        })();
      function rC(n) {
        In().remove(n);
      }
      const Oh = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        Ph = /%COMP%/g;
      function Lh(n, t) {
        return t.flat(100).map((e) => e.replace(Ph, n));
      }
      function sC(n) {
        return (t) => {
          if ("__ngUnwrap__" === t) return n;
          !1 === n(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let xl = (() => {
        class n {
          constructor(e, r, i) {
            (this.eventManager = e),
              (this.sharedStylesHost = r),
              (this.appId = i),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new Vh(e));
          }
          createRenderer(e, r) {
            if (!e || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case tn.Emulated: {
                let i = this.rendererByCompId.get(r.id);
                return (
                  i ||
                    ((i = new QO(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId
                    )),
                    this.rendererByCompId.set(r.id, i)),
                  i.applyToHost(e),
                  i
                );
              }
              case 1:
              case tn.ShadowDom:
                return new YO(this.eventManager, this.sharedStylesHost, e, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const i = Lh(r.id, r.styles);
                  this.sharedStylesHost.addStyles(i),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(Fl), v(_s), v(ds));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class Vh {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, e) {
          return e
            ? document.createElementNS(Oh[e] || e, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, e) {
          (lC(t) ? t.content : t).appendChild(e);
        }
        insertBefore(t, e, r) {
          t && (lC(t) ? t.content : t).insertBefore(e, r);
        }
        removeChild(t, e) {
          t && t.removeChild(e);
        }
        selectRootElement(t, e) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return e || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, e, r, i) {
          if (i) {
            e = i + ":" + e;
            const o = Oh[i];
            o ? t.setAttributeNS(o, e, r) : t.setAttribute(e, r);
          } else t.setAttribute(e, r);
        }
        removeAttribute(t, e, r) {
          if (r) {
            const i = Oh[r];
            i ? t.removeAttributeNS(i, e) : t.removeAttribute(`${r}:${e}`);
          } else t.removeAttribute(e);
        }
        addClass(t, e) {
          t.classList.add(e);
        }
        removeClass(t, e) {
          t.classList.remove(e);
        }
        setStyle(t, e, r, i) {
          i & (Et.DashCase | Et.Important)
            ? t.style.setProperty(e, r, i & Et.Important ? "important" : "")
            : (t.style[e] = r);
        }
        removeStyle(t, e, r) {
          r & Et.DashCase ? t.style.removeProperty(e) : (t.style[e] = "");
        }
        setProperty(t, e, r) {
          t[e] = r;
        }
        setValue(t, e) {
          t.nodeValue = e;
        }
        listen(t, e, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, e, sC(r))
            : this.eventManager.addEventListener(t, e, sC(r));
        }
      }
      function lC(n) {
        return "TEMPLATE" === n.tagName && void 0 !== n.content;
      }
      class QO extends Vh {
        constructor(t, e, r, i) {
          super(t), (this.component = r);
          const o = Lh(i + "-" + r.id, r.styles);
          e.addStyles(o),
            (this.contentAttr = (function qO(n) {
              return "_ngcontent-%COMP%".replace(Ph, n);
            })(i + "-" + r.id)),
            (this.hostAttr = (function WO(n) {
              return "_nghost-%COMP%".replace(Ph, n);
            })(i + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, e) {
          const r = super.createElement(t, e);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class YO extends Vh {
        constructor(t, e, r, i) {
          super(t),
            (this.sharedStylesHost = e),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const o = Lh(i.id, i.styles);
          for (let s = 0; s < o.length; s++) {
            const a = document.createElement("style");
            (a.textContent = o[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, e) {
          return super.appendChild(this.nodeOrShadowRoot(t), e);
        }
        insertBefore(t, e, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), e, r);
        }
        removeChild(t, e) {
          return super.removeChild(this.nodeOrShadowRoot(t), e);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
      }
      let ZO = (() => {
        class n extends tC {
          constructor(e) {
            super(e);
          }
          supports(e) {
            return !0;
          }
          addEventListener(e, r, i) {
            return (
              e.addEventListener(r, i, !1),
              () => this.removeEventListener(e, r, i)
            );
          }
          removeEventListener(e, r, i) {
            return e.removeEventListener(r, i);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(J));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const uC = ["alt", "control", "meta", "shift"],
        XO = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        JO = {
          alt: (n) => n.altKey,
          control: (n) => n.ctrlKey,
          meta: (n) => n.metaKey,
          shift: (n) => n.shiftKey,
        };
      let e1 = (() => {
        class n extends tC {
          constructor(e) {
            super(e);
          }
          supports(e) {
            return null != n.parseEventName(e);
          }
          addEventListener(e, r, i) {
            const o = n.parseEventName(r),
              s = n.eventCallback(o.fullKey, i, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => In().onAndCancel(e, o.domEventName, s));
          }
          static parseEventName(e) {
            const r = e.toLowerCase().split("."),
              i = r.shift();
            if (0 === r.length || ("keydown" !== i && "keyup" !== i))
              return null;
            const o = n._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              uC.forEach((u) => {
                const c = r.indexOf(u);
                c > -1 && (r.splice(c, 1), (s += u + "."));
              }),
              (s += o),
              0 != r.length || 0 === o.length)
            )
              return null;
            const l = {};
            return (l.domEventName = i), (l.fullKey = s), l;
          }
          static matchEventFullKeyCode(e, r) {
            let i = XO[e.key] || e.key,
              o = "";
            return (
              r.indexOf("code.") > -1 && ((i = e.code), (o = "code.")),
              !(null == i || !i) &&
                ((i = i.toLowerCase()),
                " " === i ? (i = "space") : "." === i && (i = "dot"),
                uC.forEach((s) => {
                  s !== i && (0, JO[s])(e) && (o += s + ".");
                }),
                (o += i),
                o === r)
            );
          }
          static eventCallback(e, r, i) {
            return (o) => {
              n.matchEventFullKeyCode(o, e) && i.runGuarded(() => r(o));
            };
          }
          static _normalizeKey(e) {
            return "esc" === e ? "escape" : e;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(J));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const dC = [
          { provide: cl, useValue: Wb },
          {
            provide: Zv,
            useValue: function t1() {
              kh.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: J,
            useFactory: function r1() {
              return (
                (function I0(n) {
                  Qc = n;
                })(document),
                document
              );
            },
            deps: [],
          },
        ],
        o1 = lb(FN, "browser", dC),
        hC = new w(""),
        fC = [
          {
            provide: dl,
            useClass: class jO {
              addToWindow(t) {
                (De.getAngularTestability = (r, i = !0) => {
                  const o = t.findTestabilityInTree(r, i);
                  if (null == o)
                    throw new Error("Could not find testability for element.");
                  return o;
                }),
                  (De.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (De.getAllAngularRootElements = () => t.getAllRootElements()),
                  De.frameworkStabilizers || (De.frameworkStabilizers = []),
                  De.frameworkStabilizers.push((r) => {
                    const i = De.getAllAngularTestabilities();
                    let o = i.length,
                      s = !1;
                    const a = function (l) {
                      (s = s || l), o--, 0 == o && r(s);
                    };
                    i.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, e, r) {
                return null == e
                  ? null
                  : t.getTestability(e) ??
                      (r
                        ? In().isShadowRoot(e)
                          ? this.findTestabilityInTree(t, e.host, !0)
                          : this.findTestabilityInTree(t, e.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: ib, useClass: sh, deps: [K, ah, dl] },
          { provide: sh, useClass: sh, deps: [K, ah, dl] },
        ],
        pC = [
          { provide: rd, useValue: "root" },
          {
            provide: Cn,
            useFactory: function n1() {
              return new Cn();
            },
            deps: [],
          },
          { provide: Tl, useClass: ZO, multi: !0, deps: [J, K, cl] },
          { provide: Tl, useClass: e1, multi: !0, deps: [J] },
          { provide: xl, useClass: xl, deps: [Fl, _s, ds] },
          { provide: qo, useExisting: xl },
          { provide: nC, useExisting: _s },
          { provide: _s, useClass: _s, deps: [J] },
          { provide: Fl, useClass: Fl, deps: [Tl, K] },
          { provide: class cO {}, useClass: $O, deps: [] },
          [],
        ];
      let mC = (() => {
          class n {
            constructor(e) {}
            static withServerTransition(e) {
              return {
                ngModule: n,
                providers: [
                  { provide: ds, useValue: e.appId },
                  { provide: eC, useExisting: ds },
                  UO,
                ],
              };
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(hC, 12));
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ providers: [...pC, ...fC], imports: [xh, xN] })),
            n
          );
        })(),
        gC = (() => {
          class n {
            constructor(e) {
              this._doc = e;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(e) {
              this._doc.title = e || "";
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(J));
            }),
            (n.ɵprov = I({
              token: n,
              factory: function (e) {
                let r = null;
                return (
                  (r = e
                    ? new e()
                    : (function a1() {
                        return new gC(v(J));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            n
          );
        })();
      typeof window < "u" && window;
      class Kt extends He {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const e = super._subscribe(t);
          return e && !e.closed && t.next(this._value), e;
        }
        getValue() {
          if (this.hasError) throw this.thrownError;
          if (this.closed) throw new ai();
          return this._value;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      function R(...n) {
        let t = n[n.length - 1];
        return li(t) ? (n.pop(), qu(n, t)) : Wu(n);
      }
      const bC = (() => {
          function n() {
            return (
              Error.call(this),
              (this.message = "argument out of range"),
              (this.name = "ArgumentOutOfRangeError"),
              this
            );
          }
          return (n.prototype = Object.create(Error.prototype)), n;
        })(),
        Gr = new we((n) => n.complete());
      function Uh(n) {
        return n
          ? (function E1(n) {
              return new we((t) => n.schedule(() => t.complete()));
            })(n)
          : Gr;
      }
      function fr(n) {
        return (t) => (0 === n ? Uh() : t.lift(new w1(n)));
      }
      class w1 {
        constructor(t) {
          if (((this.total = t), this.total < 0)) throw new bC();
        }
        call(t, e) {
          return e.subscribe(new M1(t, this.total));
        }
      }
      class M1 extends ye {
        constructor(t, e) {
          super(t), (this.total = e), (this.count = 0);
        }
        _next(t) {
          const e = this.total,
            r = ++this.count;
          r <= e &&
            (this.destination.next(t),
            r === e && (this.destination.complete(), this.unsubscribe()));
        }
      }
      class A1 {
        constructor(t) {
          this.total = t;
        }
        call(t, e) {
          return e.subscribe(new I1(t, this.total));
        }
      }
      class I1 extends ye {
        constructor(t, e) {
          super(t), (this.total = e), (this.count = 0);
        }
        _next(t) {
          ++this.count > this.total && this.destination.next(t);
        }
      }
      class F1 {
        constructor(t, e) {
          (this.compare = t), (this.keySelector = e);
        }
        call(t, e) {
          return e.subscribe(new x1(t, this.compare, this.keySelector));
        }
      }
      class x1 extends ye {
        constructor(t, e, r) {
          super(t),
            (this.keySelector = r),
            (this.hasKey = !1),
            "function" == typeof e && (this.compare = e);
        }
        compare(t, e) {
          return t === e;
        }
        _next(t) {
          let e;
          try {
            const { keySelector: i } = this;
            e = i ? i(t) : t;
          } catch (i) {
            return this.destination.error(i);
          }
          let r = !1;
          if (this.hasKey)
            try {
              const { compare: i } = this;
              r = i(this.key, e);
            } catch (i) {
              return this.destination.error(i);
            }
          else this.hasKey = !0;
          r || ((this.key = e), this.destination.next(t));
        }
      }
      function vs(n) {
        return (t) => t.lift(new R1(n));
      }
      class R1 {
        constructor(t) {
          this.notifier = t;
        }
        call(t, e) {
          const r = new N1(t),
            i = Eo(this.notifier, new Co(r));
          return i && !r.seenValue ? (r.add(i), e.subscribe(r)) : r;
        }
      }
      class N1 extends Do {
        constructor(t) {
          super(t), (this.seenValue = !1);
        }
        notifyNext() {
          (this.seenValue = !0), this.complete();
        }
        notifyComplete() {}
      }
      function Qt(n) {
        return null != n && "false" != `${n}`;
      }
      function pr(n) {
        return n instanceof fe ? n.nativeElement : n;
      }
      let $h;
      try {
        $h = typeof Intl < "u" && Intl.v8BreakIterator;
      } catch {
        $h = !1;
      }
      let Zi,
        _t = (() => {
          class n {
            constructor(e) {
              (this._platformId = e),
                (this.isBrowser = this._platformId
                  ? (function sO(n) {
                      return n === Wb;
                    })(this._platformId)
                  : "object" == typeof document && !!document),
                (this.EDGE =
                  this.isBrowser && /(edge)/i.test(navigator.userAgent)),
                (this.TRIDENT =
                  this.isBrowser &&
                  /(msie|trident)/i.test(navigator.userAgent)),
                (this.BLINK =
                  this.isBrowser &&
                  !(!window.chrome && !$h) &&
                  typeof CSS < "u" &&
                  !this.EDGE &&
                  !this.TRIDENT),
                (this.WEBKIT =
                  this.isBrowser &&
                  /AppleWebKit/i.test(navigator.userAgent) &&
                  !this.BLINK &&
                  !this.EDGE &&
                  !this.TRIDENT),
                (this.IOS =
                  this.isBrowser &&
                  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                  !("MSStream" in window)),
                (this.FIREFOX =
                  this.isBrowser &&
                  /(firefox|minefield)/i.test(navigator.userAgent)),
                (this.ANDROID =
                  this.isBrowser &&
                  /android/i.test(navigator.userAgent) &&
                  !this.TRIDENT),
                (this.SAFARI =
                  this.isBrowser &&
                  /safari/i.test(navigator.userAgent) &&
                  this.WEBKIT);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(cl));
            }),
            (n.ɵprov = I({
              factory: function () {
                return new n(v(cl));
              },
              token: n,
              providedIn: "root",
            })),
            n
          );
        })(),
        Nl = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({})),
            n
          );
        })();
      const CC = [
        "color",
        "button",
        "checkbox",
        "date",
        "datetime-local",
        "email",
        "file",
        "hidden",
        "image",
        "month",
        "number",
        "password",
        "radio",
        "range",
        "reset",
        "search",
        "submit",
        "tel",
        "text",
        "time",
        "url",
        "week",
      ];
      function DC() {
        if (Zi) return Zi;
        if ("object" != typeof document || !document)
          return (Zi = new Set(CC)), Zi;
        let n = document.createElement("input");
        return (
          (Zi = new Set(
            CC.filter((t) => (n.setAttribute("type", t), n.type === t))
          )),
          Zi
        );
      }
      let bs, zh;
      function kl(n) {
        return (function O1() {
          if (null == bs && typeof window < "u")
            try {
              window.addEventListener(
                "test",
                null,
                Object.defineProperty({}, "passive", { get: () => (bs = !0) })
              );
            } finally {
              bs = bs || !1;
            }
          return bs;
        })()
          ? n
          : !!n.capture;
      }
      function Cs(n) {
        return n.composedPath ? n.composedPath()[0] : n.target;
      }
      class H1 extends Se {
        constructor(t, e) {
          super();
        }
        schedule(t, e = 0) {
          return this;
        }
      }
      let EC = (() => {
        class n {
          constructor(e, r = n.now) {
            (this.SchedulerAction = e), (this.now = r);
          }
          schedule(e, r = 0, i) {
            return new this.SchedulerAction(this, e).schedule(i, r);
          }
        }
        return (n.now = () => Date.now()), n;
      })();
      class mr extends EC {
        constructor(t, e = EC.now) {
          super(t, () =>
            mr.delegate && mr.delegate !== this ? mr.delegate.now() : e()
          ),
            (this.actions = []),
            (this.active = !1),
            (this.scheduled = void 0);
        }
        schedule(t, e = 0, r) {
          return mr.delegate && mr.delegate !== this
            ? mr.delegate.schedule(t, e, r)
            : super.schedule(t, e, r);
        }
        flush(t) {
          const { actions: e } = this;
          if (this.active) return void e.push(t);
          let r;
          this.active = !0;
          do {
            if ((r = t.execute(t.state, t.delay))) break;
          } while ((t = e.shift()));
          if (((this.active = !1), r)) {
            for (; (t = e.shift()); ) t.unsubscribe();
            throw r;
          }
        }
      }
      const Gh = new mr(
        class U1 extends H1 {
          constructor(t, e) {
            super(t, e),
              (this.scheduler = t),
              (this.work = e),
              (this.pending = !1);
          }
          schedule(t, e = 0) {
            if (this.closed) return this;
            this.state = t;
            const r = this.id,
              i = this.scheduler;
            return (
              null != r && (this.id = this.recycleAsyncId(i, r, e)),
              (this.pending = !0),
              (this.delay = e),
              (this.id = this.id || this.requestAsyncId(i, this.id, e)),
              this
            );
          }
          requestAsyncId(t, e, r = 0) {
            return setInterval(t.flush.bind(t, this), r);
          }
          recycleAsyncId(t, e, r = 0) {
            if (null !== r && this.delay === r && !1 === this.pending) return e;
            clearInterval(e);
          }
          execute(t, e) {
            if (this.closed) return new Error("executing a cancelled action");
            this.pending = !1;
            const r = this._execute(t, e);
            if (r) return r;
            !1 === this.pending &&
              null != this.id &&
              (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
          }
          _execute(t, e) {
            let i,
              r = !1;
            try {
              this.work(t);
            } catch (o) {
              (r = !0), (i = (!!o && o) || new Error(o));
            }
            if (r) return this.unsubscribe(), i;
          }
          _unsubscribe() {
            const t = this.id,
              e = this.scheduler,
              r = e.actions,
              i = r.indexOf(this);
            (this.work = null),
              (this.state = null),
              (this.pending = !1),
              (this.scheduler = null),
              -1 !== i && r.splice(i, 1),
              null != t && (this.id = this.recycleAsyncId(e, t, null)),
              (this.delay = null);
          }
        }
      );
      class $1 {
        constructor(t, e) {
          (this.dueTime = t), (this.scheduler = e);
        }
        call(t, e) {
          return e.subscribe(new z1(t, this.dueTime, this.scheduler));
        }
      }
      class z1 extends ye {
        constructor(t, e, r) {
          super(t),
            (this.dueTime = e),
            (this.scheduler = r),
            (this.debouncedSubscription = null),
            (this.lastValue = null),
            (this.hasValue = !1);
        }
        _next(t) {
          this.clearDebounce(),
            (this.lastValue = t),
            (this.hasValue = !0),
            this.add(
              (this.debouncedSubscription = this.scheduler.schedule(
                G1,
                this.dueTime,
                this
              ))
            );
        }
        _complete() {
          this.debouncedNext(), this.destination.complete();
        }
        debouncedNext() {
          if ((this.clearDebounce(), this.hasValue)) {
            const { lastValue: t } = this;
            (this.lastValue = null),
              (this.hasValue = !1),
              this.destination.next(t);
          }
        }
        clearDebounce() {
          const t = this.debouncedSubscription;
          null !== t &&
            (this.remove(t),
            t.unsubscribe(),
            (this.debouncedSubscription = null));
        }
      }
      function G1(n) {
        n.debouncedNext();
      }
      let qh = (() => {
          class n {
            create(e) {
              return typeof MutationObserver > "u"
                ? null
                : new MutationObserver(e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = I({
              factory: function () {
                return new n();
              },
              token: n,
              providedIn: "root",
            })),
            n
          );
        })(),
        wC = (() => {
          class n {
            constructor(e) {
              (this._mutationObserverFactory = e),
                (this._observedElements = new Map());
            }
            ngOnDestroy() {
              this._observedElements.forEach((e, r) =>
                this._cleanupObserver(r)
              );
            }
            observe(e) {
              const r = pr(e);
              return new we((i) => {
                const s = this._observeElement(r).subscribe(i);
                return () => {
                  s.unsubscribe(), this._unobserveElement(r);
                };
              });
            }
            _observeElement(e) {
              if (this._observedElements.has(e))
                this._observedElements.get(e).count++;
              else {
                const r = new He(),
                  i = this._mutationObserverFactory.create((o) => r.next(o));
                i &&
                  i.observe(e, {
                    characterData: !0,
                    childList: !0,
                    subtree: !0,
                  }),
                  this._observedElements.set(e, {
                    observer: i,
                    stream: r,
                    count: 1,
                  });
              }
              return this._observedElements.get(e).stream;
            }
            _unobserveElement(e) {
              this._observedElements.has(e) &&
                (this._observedElements.get(e).count--,
                this._observedElements.get(e).count ||
                  this._cleanupObserver(e));
            }
            _cleanupObserver(e) {
              if (this._observedElements.has(e)) {
                const { observer: r, stream: i } =
                  this._observedElements.get(e);
                r && r.disconnect(),
                  i.complete(),
                  this._observedElements.delete(e);
              }
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(qh));
            }),
            (n.ɵprov = I({
              factory: function () {
                return new n(v(qh));
              },
              token: n,
              providedIn: "root",
            })),
            n
          );
        })(),
        q1 = (() => {
          class n {
            constructor(e, r, i) {
              (this._contentObserver = e),
                (this._elementRef = r),
                (this._ngZone = i),
                (this.event = new pe()),
                (this._disabled = !1),
                (this._currentSubscription = null);
            }
            get disabled() {
              return this._disabled;
            }
            set disabled(e) {
              (this._disabled = Qt(e)),
                this._disabled ? this._unsubscribe() : this._subscribe();
            }
            get debounce() {
              return this._debounce;
            }
            set debounce(e) {
              (this._debounce = (function jh(n, t = 0) {
                return (function k1(n) {
                  return !isNaN(parseFloat(n)) && !isNaN(Number(n));
                })(n)
                  ? Number(n)
                  : t;
              })(e)),
                this._subscribe();
            }
            ngAfterContentInit() {
              !this._currentSubscription && !this.disabled && this._subscribe();
            }
            ngOnDestroy() {
              this._unsubscribe();
            }
            _subscribe() {
              this._unsubscribe();
              const e = this._contentObserver.observe(this._elementRef);
              this._ngZone.runOutsideAngular(() => {
                this._currentSubscription = (
                  this.debounce
                    ? e.pipe(
                        (function j1(n, t = Gh) {
                          return (e) => e.lift(new $1(n, t));
                        })(this.debounce)
                      )
                    : e
                ).subscribe(this.event);
              });
            }
            _unsubscribe() {
              var e;
              null === (e = this._currentSubscription) ||
                void 0 === e ||
                e.unsubscribe();
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(g(wC), g(fe), g(K));
            }),
            (n.ɵdir = M({
              type: n,
              selectors: [["", "cdkObserveContent", ""]],
              inputs: {
                disabled: ["cdkObserveContentDisabled", "disabled"],
                debounce: "debounce",
              },
              outputs: { event: "cdkObserveContent" },
              exportAs: ["cdkObserveContent"],
            })),
            n
          );
        })(),
        MC = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ providers: [qh] })),
            n
          );
        })();
      function xC(n) {
        return 0 === n.offsetX && 0 === n.offsetY;
      }
      function RC(n) {
        const t =
          (n.touches && n.touches[0]) ||
          (n.changedTouches && n.changedTouches[0]);
        return !(
          !t ||
          -1 !== t.identifier ||
          (null != t.radiusX && 1 !== t.radiusX) ||
          (null != t.radiusY && 1 !== t.radiusY)
        );
      }
      typeof Element < "u" && Element;
      const NC = new w("cdk-input-modality-detector-options"),
        dP = { ignoreKeys: [18, 17, 224, 91, 16] },
        Xi = kl({ passive: !0, capture: !0 });
      let OC = (() => {
        class n {
          constructor(e, r, i, o) {
            (this._platform = e),
              (this._mostRecentTarget = null),
              (this._modality = new Kt(null)),
              (this._lastTouchMs = 0),
              (this._onKeydown = (s) => {
                var a, l;
                (null !==
                  (l =
                    null === (a = this._options) || void 0 === a
                      ? void 0
                      : a.ignoreKeys) &&
                  void 0 !== l &&
                  l.some((u) => u === s.keyCode)) ||
                  (this._modality.next("keyboard"),
                  (this._mostRecentTarget = Cs(s)));
              }),
              (this._onMousedown = (s) => {
                Date.now() - this._lastTouchMs < 650 ||
                  (this._modality.next(xC(s) ? "keyboard" : "mouse"),
                  (this._mostRecentTarget = Cs(s)));
              }),
              (this._onTouchstart = (s) => {
                RC(s)
                  ? this._modality.next("keyboard")
                  : ((this._lastTouchMs = Date.now()),
                    this._modality.next("touch"),
                    (this._mostRecentTarget = Cs(s)));
              }),
              (this._options = Object.assign(Object.assign({}, dP), o)),
              (this.modalityDetected = this._modality.pipe(
                (function S1(n) {
                  return (t) => t.lift(new A1(n));
                })(1)
              )),
              (this.modalityChanged = this.modalityDetected.pipe(
                (function T1(n, t) {
                  return (e) => e.lift(new F1(n, t));
                })()
              )),
              e.isBrowser &&
                r.runOutsideAngular(() => {
                  i.addEventListener("keydown", this._onKeydown, Xi),
                    i.addEventListener("mousedown", this._onMousedown, Xi),
                    i.addEventListener("touchstart", this._onTouchstart, Xi);
                });
          }
          get mostRecentModality() {
            return this._modality.value;
          }
          ngOnDestroy() {
            this._modality.complete(),
              this._platform.isBrowser &&
                (document.removeEventListener("keydown", this._onKeydown, Xi),
                document.removeEventListener(
                  "mousedown",
                  this._onMousedown,
                  Xi
                ),
                document.removeEventListener(
                  "touchstart",
                  this._onTouchstart,
                  Xi
                ));
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(_t), v(K), v(J), v(NC, 8));
          }),
          (n.ɵprov = I({
            factory: function () {
              return new n(v(_t), v(K), v(J), v(NC, 8));
            },
            token: n,
            providedIn: "root",
          })),
          n
        );
      })();
      const VC = new w("cdk-focus-monitor-default-options"),
        Pl = kl({ passive: !0, capture: !0 });
      let Wh = (() => {
        class n {
          constructor(e, r, i, o, s) {
            (this._ngZone = e),
              (this._platform = r),
              (this._inputModalityDetector = i),
              (this._origin = null),
              (this._windowFocused = !1),
              (this._originFromTouchInteraction = !1),
              (this._elementInfo = new Map()),
              (this._monitoredElementCount = 0),
              (this._rootNodeFocusListenerCount = new Map()),
              (this._windowFocusListener = () => {
                (this._windowFocused = !0),
                  (this._windowFocusTimeoutId = setTimeout(
                    () => (this._windowFocused = !1)
                  ));
              }),
              (this._stopInputModalityDetector = new He()),
              (this._rootNodeFocusAndBlurListener = (a) => {
                const l = Cs(a),
                  u = "focus" === a.type ? this._onFocus : this._onBlur;
                for (let c = l; c; c = c.parentElement) u.call(this, a, c);
              }),
              (this._document = o),
              (this._detectionMode = s?.detectionMode || 0);
          }
          monitor(e, r = !1) {
            const i = pr(e);
            if (!this._platform.isBrowser || 1 !== i.nodeType) return R(null);
            const o =
                (function L1(n) {
                  if (
                    (function P1() {
                      if (null == zh) {
                        const n = typeof document < "u" ? document.head : null;
                        zh = !(!n || (!n.createShadowRoot && !n.attachShadow));
                      }
                      return zh;
                    })()
                  ) {
                    const t = n.getRootNode ? n.getRootNode() : null;
                    if (
                      typeof ShadowRoot < "u" &&
                      ShadowRoot &&
                      t instanceof ShadowRoot
                    )
                      return t;
                  }
                  return null;
                })(i) || this._getDocument(),
              s = this._elementInfo.get(i);
            if (s) return r && (s.checkChildren = !0), s.subject;
            const a = { checkChildren: r, subject: new He(), rootNode: o };
            return (
              this._elementInfo.set(i, a),
              this._registerGlobalListeners(a),
              a.subject
            );
          }
          stopMonitoring(e) {
            const r = pr(e),
              i = this._elementInfo.get(r);
            i &&
              (i.subject.complete(),
              this._setClasses(r),
              this._elementInfo.delete(r),
              this._removeGlobalListeners(i));
          }
          focusVia(e, r, i) {
            const o = pr(e);
            o === this._getDocument().activeElement
              ? this._getClosestElementsInfo(o).forEach(([a, l]) =>
                  this._originChanged(a, r, l)
                )
              : (this._setOrigin(r),
                "function" == typeof o.focus && o.focus(i));
          }
          ngOnDestroy() {
            this._elementInfo.forEach((e, r) => this.stopMonitoring(r));
          }
          _getDocument() {
            return this._document || document;
          }
          _getWindow() {
            return this._getDocument().defaultView || window;
          }
          _toggleClass(e, r, i) {
            i ? e.classList.add(r) : e.classList.remove(r);
          }
          _getFocusOrigin(e) {
            return this._origin
              ? this._originFromTouchInteraction
                ? this._shouldBeAttributedToTouch(e)
                  ? "touch"
                  : "program"
                : this._origin
              : this._windowFocused && this._lastFocusOrigin
              ? this._lastFocusOrigin
              : "program";
          }
          _shouldBeAttributedToTouch(e) {
            return (
              1 === this._detectionMode ||
              !!e?.contains(this._inputModalityDetector._mostRecentTarget)
            );
          }
          _setClasses(e, r) {
            this._toggleClass(e, "cdk-focused", !!r),
              this._toggleClass(e, "cdk-touch-focused", "touch" === r),
              this._toggleClass(e, "cdk-keyboard-focused", "keyboard" === r),
              this._toggleClass(e, "cdk-mouse-focused", "mouse" === r),
              this._toggleClass(e, "cdk-program-focused", "program" === r);
          }
          _setOrigin(e, r = !1) {
            this._ngZone.runOutsideAngular(() => {
              (this._origin = e),
                (this._originFromTouchInteraction = "touch" === e && r),
                0 === this._detectionMode &&
                  (clearTimeout(this._originTimeoutId),
                  (this._originTimeoutId = setTimeout(
                    () => (this._origin = null),
                    this._originFromTouchInteraction ? 650 : 1
                  )));
            });
          }
          _onFocus(e, r) {
            const i = this._elementInfo.get(r),
              o = Cs(e);
            !i ||
              (!i.checkChildren && r !== o) ||
              this._originChanged(r, this._getFocusOrigin(o), i);
          }
          _onBlur(e, r) {
            const i = this._elementInfo.get(r);
            !i ||
              (i.checkChildren &&
                e.relatedTarget instanceof Node &&
                r.contains(e.relatedTarget)) ||
              (this._setClasses(r), this._emitOrigin(i.subject, null));
          }
          _emitOrigin(e, r) {
            this._ngZone.run(() => e.next(r));
          }
          _registerGlobalListeners(e) {
            if (!this._platform.isBrowser) return;
            const r = e.rootNode,
              i = this._rootNodeFocusListenerCount.get(r) || 0;
            i ||
              this._ngZone.runOutsideAngular(() => {
                r.addEventListener(
                  "focus",
                  this._rootNodeFocusAndBlurListener,
                  Pl
                ),
                  r.addEventListener(
                    "blur",
                    this._rootNodeFocusAndBlurListener,
                    Pl
                  );
              }),
              this._rootNodeFocusListenerCount.set(r, i + 1),
              1 == ++this._monitoredElementCount &&
                (this._ngZone.runOutsideAngular(() => {
                  this._getWindow().addEventListener(
                    "focus",
                    this._windowFocusListener
                  );
                }),
                this._inputModalityDetector.modalityDetected
                  .pipe(vs(this._stopInputModalityDetector))
                  .subscribe((o) => {
                    this._setOrigin(o, !0);
                  }));
          }
          _removeGlobalListeners(e) {
            const r = e.rootNode;
            if (this._rootNodeFocusListenerCount.has(r)) {
              const i = this._rootNodeFocusListenerCount.get(r);
              i > 1
                ? this._rootNodeFocusListenerCount.set(r, i - 1)
                : (r.removeEventListener(
                    "focus",
                    this._rootNodeFocusAndBlurListener,
                    Pl
                  ),
                  r.removeEventListener(
                    "blur",
                    this._rootNodeFocusAndBlurListener,
                    Pl
                  ),
                  this._rootNodeFocusListenerCount.delete(r));
            }
            --this._monitoredElementCount ||
              (this._getWindow().removeEventListener(
                "focus",
                this._windowFocusListener
              ),
              this._stopInputModalityDetector.next(),
              clearTimeout(this._windowFocusTimeoutId),
              clearTimeout(this._originTimeoutId));
          }
          _originChanged(e, r, i) {
            this._setClasses(e, r),
              this._emitOrigin(i.subject, r),
              (this._lastFocusOrigin = r);
          }
          _getClosestElementsInfo(e) {
            const r = [];
            return (
              this._elementInfo.forEach((i, o) => {
                (o === e || (i.checkChildren && o.contains(e))) &&
                  r.push([o, i]);
              }),
              r
            );
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(K), v(_t), v(OC), v(J, 8), v(VC, 8));
          }),
          (n.ɵprov = I({
            factory: function () {
              return new n(v(K), v(_t), v(OC), v(J, 8), v(VC, 8));
            },
            token: n,
            providedIn: "root",
          })),
          n
        );
      })();
      const BC = "cdk-high-contrast-black-on-white",
        HC = "cdk-high-contrast-white-on-black",
        Kh = "cdk-high-contrast-active";
      let UC = (() => {
        class n {
          constructor(e, r) {
            (this._platform = e), (this._document = r);
          }
          getHighContrastMode() {
            if (!this._platform.isBrowser) return 0;
            const e = this._document.createElement("div");
            (e.style.backgroundColor = "rgb(1,2,3)"),
              (e.style.position = "absolute"),
              this._document.body.appendChild(e);
            const r = this._document.defaultView || window,
              i = r && r.getComputedStyle ? r.getComputedStyle(e) : null,
              o = ((i && i.backgroundColor) || "").replace(/ /g, "");
            switch ((this._document.body.removeChild(e), o)) {
              case "rgb(0,0,0)":
                return 2;
              case "rgb(255,255,255)":
                return 1;
            }
            return 0;
          }
          _applyBodyHighContrastModeCssClasses() {
            if (
              !this._hasCheckedHighContrastMode &&
              this._platform.isBrowser &&
              this._document.body
            ) {
              const e = this._document.body.classList;
              e.remove(Kh),
                e.remove(BC),
                e.remove(HC),
                (this._hasCheckedHighContrastMode = !0);
              const r = this.getHighContrastMode();
              1 === r
                ? (e.add(Kh), e.add(BC))
                : 2 === r && (e.add(Kh), e.add(HC));
            }
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(_t), v(J));
          }),
          (n.ɵprov = I({
            factory: function () {
              return new n(v(_t), v(J));
            },
            token: n,
            providedIn: "root",
          })),
          n
        );
      })();
      const jC = new w("cdk-dir-doc", {
        providedIn: "root",
        factory: function pP() {
          return Y(J);
        },
      });
      let $C = (() => {
          class n {
            constructor(e) {
              if (((this.value = "ltr"), (this.change = new pe()), e)) {
                const i = e.documentElement ? e.documentElement.dir : null,
                  o = (e.body ? e.body.dir : null) || i;
                this.value = "ltr" === o || "rtl" === o ? o : "ltr";
              }
            }
            ngOnDestroy() {
              this.change.complete();
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(jC, 8));
            }),
            (n.ɵprov = I({
              factory: function () {
                return new n(v(jC, 8));
              },
              token: n,
              providedIn: "root",
            })),
            n
          );
        })(),
        zC = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({})),
            n
          );
        })();
      const GC = new lr("12.2.13"),
        qC = new lr("12.2.13"),
        CP = new w("mat-sanity-checks", {
          providedIn: "root",
          factory: function bP() {
            return !0;
          },
        });
      let Wr,
        vt = (() => {
          class n {
            constructor(e, r, i) {
              (this._hasDoneGlobalChecks = !1),
                (this._document = i),
                e._applyBodyHighContrastModeCssClasses(),
                (this._sanityChecks = r),
                this._hasDoneGlobalChecks ||
                  (this._checkDoctypeIsDefined(),
                  this._checkThemeIsPresent(),
                  this._checkCdkVersionMatch(),
                  (this._hasDoneGlobalChecks = !0));
            }
            _checkIsEnabled(e) {
              return !1;
            }
            _checkDoctypeIsDefined() {
              this._checkIsEnabled("doctype") &&
                !this._document.doctype &&
                console.warn(
                  "Current document does not have a doctype. This may cause some Angular Material components not to behave as expected."
                );
            }
            _checkThemeIsPresent() {
              if (
                !this._checkIsEnabled("theme") ||
                !this._document.body ||
                "function" != typeof getComputedStyle
              )
                return;
              const e = this._document.createElement("div");
              e.classList.add("mat-theme-loaded-marker"),
                this._document.body.appendChild(e);
              const r = getComputedStyle(e);
              r &&
                "none" !== r.display &&
                console.warn(
                  "Could not find Angular Material core theme. Most Material components may not work as expected. For more info refer to the theming guide: https://material.angular.io/guide/theming"
                ),
                this._document.body.removeChild(e);
            }
            _checkCdkVersionMatch() {
              this._checkIsEnabled("version") &&
                qC.full !== GC.full &&
                console.warn(
                  "The Angular Material version (" +
                    qC.full +
                    ") does not match the Angular CDK version (" +
                    GC.full +
                    ").\nPlease ensure the versions of these two packages exactly match."
                );
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(UC), v(CP, 8), v(J));
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ imports: [zC, zC] })),
            n
          );
        })();
      function WC(n) {
        return class extends n {
          constructor(...t) {
            super(...t), (this._disabled = !1);
          }
          get disabled() {
            return this._disabled;
          }
          set disabled(t) {
            this._disabled = Qt(t);
          }
        };
      }
      function Qh(n, t) {
        return class extends n {
          constructor(...e) {
            super(...e), (this.defaultColor = t), (this.color = t);
          }
          get color() {
            return this._color;
          }
          set color(e) {
            const r = e || this.defaultColor;
            r !== this._color &&
              (this._color &&
                this._elementRef.nativeElement.classList.remove(
                  `mat-${this._color}`
                ),
              r && this._elementRef.nativeElement.classList.add(`mat-${r}`),
              (this._color = r));
          }
        };
      }
      function DP(n) {
        return class extends n {
          constructor(...t) {
            super(...t), (this._disableRipple = !1);
          }
          get disableRipple() {
            return this._disableRipple;
          }
          set disableRipple(t) {
            this._disableRipple = Qt(t);
          }
        };
      }
      function EP(n) {
        return class extends n {
          constructor(...t) {
            super(...t), (this.stateChanges = new He()), (this.errorState = !1);
          }
          updateErrorState() {
            const t = this.errorState,
              o = (
                this.errorStateMatcher || this._defaultErrorStateMatcher
              ).isErrorState(
                this.ngControl ? this.ngControl.control : null,
                this._parentFormGroup || this._parentForm
              );
            o !== t && ((this.errorState = o), this.stateChanges.next());
          }
        };
      }
      try {
        Wr = typeof Intl < "u";
      } catch {
        Wr = !1;
      }
      let QC = (() => {
        class n {
          isErrorState(e, r) {
            return !!(e && e.invalid && (e.touched || (r && r.submitted)));
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = I({
            factory: function () {
              return new n();
            },
            token: n,
            providedIn: "root",
          })),
          n
        );
      })();
      class OP {
        constructor(t, e, r) {
          (this._renderer = t),
            (this.element = e),
            (this.config = r),
            (this.state = 3);
        }
        fadeOut() {
          this._renderer.fadeOutRipple(this);
        }
      }
      const YC = { enterDuration: 225, exitDuration: 150 },
        Yh = kl({ passive: !0 }),
        ZC = ["mousedown", "touchstart"],
        XC = ["mouseup", "mouseleave", "touchend", "touchcancel"];
      class LP {
        constructor(t, e, r, i) {
          (this._target = t),
            (this._ngZone = e),
            (this._isPointerDown = !1),
            (this._activeRipples = new Set()),
            (this._pointerUpEventsRegistered = !1),
            i.isBrowser && (this._containerElement = pr(r));
        }
        fadeInRipple(t, e, r = {}) {
          const i = (this._containerRect =
              this._containerRect ||
              this._containerElement.getBoundingClientRect()),
            o = Object.assign(Object.assign({}, YC), r.animation);
          r.centered &&
            ((t = i.left + i.width / 2), (e = i.top + i.height / 2));
          const s =
              r.radius ||
              (function BP(n, t, e) {
                const r = Math.max(Math.abs(n - e.left), Math.abs(n - e.right)),
                  i = Math.max(Math.abs(t - e.top), Math.abs(t - e.bottom));
                return Math.sqrt(r * r + i * i);
              })(t, e, i),
            a = t - i.left,
            l = e - i.top,
            u = o.enterDuration,
            c = document.createElement("div");
          c.classList.add("mat-ripple-element"),
            (c.style.left = a - s + "px"),
            (c.style.top = l - s + "px"),
            (c.style.height = 2 * s + "px"),
            (c.style.width = 2 * s + "px"),
            null != r.color && (c.style.backgroundColor = r.color),
            (c.style.transitionDuration = `${u}ms`),
            this._containerElement.appendChild(c),
            (function VP(n) {
              window.getComputedStyle(n).getPropertyValue("opacity");
            })(c),
            (c.style.transform = "scale(1)");
          const d = new OP(this, c, r);
          return (
            (d.state = 0),
            this._activeRipples.add(d),
            r.persistent || (this._mostRecentTransientRipple = d),
            this._runTimeoutOutsideZone(() => {
              const h = d === this._mostRecentTransientRipple;
              (d.state = 1),
                !r.persistent && (!h || !this._isPointerDown) && d.fadeOut();
            }, u),
            d
          );
        }
        fadeOutRipple(t) {
          const e = this._activeRipples.delete(t);
          if (
            (t === this._mostRecentTransientRipple &&
              (this._mostRecentTransientRipple = null),
            this._activeRipples.size || (this._containerRect = null),
            !e)
          )
            return;
          const r = t.element,
            i = Object.assign(Object.assign({}, YC), t.config.animation);
          (r.style.transitionDuration = `${i.exitDuration}ms`),
            (r.style.opacity = "0"),
            (t.state = 2),
            this._runTimeoutOutsideZone(() => {
              (t.state = 3), r.parentNode.removeChild(r);
            }, i.exitDuration);
        }
        fadeOutAll() {
          this._activeRipples.forEach((t) => t.fadeOut());
        }
        fadeOutAllNonPersistent() {
          this._activeRipples.forEach((t) => {
            t.config.persistent || t.fadeOut();
          });
        }
        setupTriggerEvents(t) {
          const e = pr(t);
          !e ||
            e === this._triggerElement ||
            (this._removeTriggerEvents(),
            (this._triggerElement = e),
            this._registerEvents(ZC));
        }
        handleEvent(t) {
          "mousedown" === t.type
            ? this._onMousedown(t)
            : "touchstart" === t.type
            ? this._onTouchStart(t)
            : this._onPointerUp(),
            this._pointerUpEventsRegistered ||
              (this._registerEvents(XC),
              (this._pointerUpEventsRegistered = !0));
        }
        _onMousedown(t) {
          const e = xC(t),
            r =
              this._lastTouchStartEvent &&
              Date.now() < this._lastTouchStartEvent + 800;
          !this._target.rippleDisabled &&
            !e &&
            !r &&
            ((this._isPointerDown = !0),
            this.fadeInRipple(t.clientX, t.clientY, this._target.rippleConfig));
        }
        _onTouchStart(t) {
          if (!this._target.rippleDisabled && !RC(t)) {
            (this._lastTouchStartEvent = Date.now()),
              (this._isPointerDown = !0);
            const e = t.changedTouches;
            for (let r = 0; r < e.length; r++)
              this.fadeInRipple(
                e[r].clientX,
                e[r].clientY,
                this._target.rippleConfig
              );
          }
        }
        _onPointerUp() {
          !this._isPointerDown ||
            ((this._isPointerDown = !1),
            this._activeRipples.forEach((t) => {
              !t.config.persistent &&
                (1 === t.state ||
                  (t.config.terminateOnPointerUp && 0 === t.state)) &&
                t.fadeOut();
            }));
        }
        _runTimeoutOutsideZone(t, e = 0) {
          this._ngZone.runOutsideAngular(() => setTimeout(t, e));
        }
        _registerEvents(t) {
          this._ngZone.runOutsideAngular(() => {
            t.forEach((e) => {
              this._triggerElement.addEventListener(e, this, Yh);
            });
          });
        }
        _removeTriggerEvents() {
          this._triggerElement &&
            (ZC.forEach((t) => {
              this._triggerElement.removeEventListener(t, this, Yh);
            }),
            this._pointerUpEventsRegistered &&
              XC.forEach((t) => {
                this._triggerElement.removeEventListener(t, this, Yh);
              }));
        }
      }
      const HP = new w("mat-ripple-global-options");
      let Vl = (() => {
          class n {
            constructor(e, r, i, o, s) {
              (this._elementRef = e),
                (this._animationMode = s),
                (this.radius = 0),
                (this._disabled = !1),
                (this._isInitialized = !1),
                (this._globalOptions = o || {}),
                (this._rippleRenderer = new LP(this, r, e, i));
            }
            get disabled() {
              return this._disabled;
            }
            set disabled(e) {
              e && this.fadeOutAllNonPersistent(),
                (this._disabled = e),
                this._setupTriggerEventsIfEnabled();
            }
            get trigger() {
              return this._trigger || this._elementRef.nativeElement;
            }
            set trigger(e) {
              (this._trigger = e), this._setupTriggerEventsIfEnabled();
            }
            ngOnInit() {
              (this._isInitialized = !0), this._setupTriggerEventsIfEnabled();
            }
            ngOnDestroy() {
              this._rippleRenderer._removeTriggerEvents();
            }
            fadeOutAll() {
              this._rippleRenderer.fadeOutAll();
            }
            fadeOutAllNonPersistent() {
              this._rippleRenderer.fadeOutAllNonPersistent();
            }
            get rippleConfig() {
              return {
                centered: this.centered,
                radius: this.radius,
                color: this.color,
                animation: Object.assign(
                  Object.assign(
                    Object.assign({}, this._globalOptions.animation),
                    "NoopAnimations" === this._animationMode
                      ? { enterDuration: 0, exitDuration: 0 }
                      : {}
                  ),
                  this.animation
                ),
                terminateOnPointerUp: this._globalOptions.terminateOnPointerUp,
              };
            }
            get rippleDisabled() {
              return this.disabled || !!this._globalOptions.disabled;
            }
            _setupTriggerEventsIfEnabled() {
              !this.disabled &&
                this._isInitialized &&
                this._rippleRenderer.setupTriggerEvents(this.trigger);
            }
            launch(e, r = 0, i) {
              return "number" == typeof e
                ? this._rippleRenderer.fadeInRipple(
                    e,
                    r,
                    Object.assign(Object.assign({}, this.rippleConfig), i)
                  )
                : this._rippleRenderer.fadeInRipple(
                    0,
                    0,
                    Object.assign(Object.assign({}, this.rippleConfig), e)
                  );
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(g(fe), g(K), g(_t), g(HP, 8), g(cr, 8));
            }),
            (n.ɵdir = M({
              type: n,
              selectors: [
                ["", "mat-ripple", ""],
                ["", "matRipple", ""],
              ],
              hostAttrs: [1, "mat-ripple"],
              hostVars: 2,
              hostBindings: function (e, r) {
                2 & e && Le("mat-ripple-unbounded", r.unbounded);
              },
              inputs: {
                radius: ["matRippleRadius", "radius"],
                disabled: ["matRippleDisabled", "disabled"],
                trigger: ["matRippleTrigger", "trigger"],
                color: ["matRippleColor", "color"],
                unbounded: ["matRippleUnbounded", "unbounded"],
                centered: ["matRippleCentered", "centered"],
                animation: ["matRippleAnimation", "animation"],
              },
              exportAs: ["matRipple"],
            })),
            n
          );
        })(),
        JC = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ imports: [vt, Nl, vt] })),
            n
          );
        })();
      const KP = ["*", [["mat-card-footer"]]],
        QP = ["*", "mat-card-footer"],
        XP = [
          [
            ["mat-card-title"],
            ["mat-card-subtitle"],
            ["", "mat-card-title", ""],
            ["", "mat-card-subtitle", ""],
            ["", "matCardTitle", ""],
            ["", "matCardSubtitle", ""],
          ],
          [["img"]],
          "*",
        ],
        JP = [
          "mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]",
          "img",
          "*",
        ];
      let eL = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵdir = M({
              type: n,
              selectors: [
                ["mat-card-title"],
                ["", "mat-card-title", ""],
                ["", "matCardTitle", ""],
              ],
              hostAttrs: [1, "mat-card-title"],
            })),
            n
          );
        })(),
        tL = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵdir = M({
              type: n,
              selectors: [
                ["mat-card-subtitle"],
                ["", "mat-card-subtitle", ""],
                ["", "matCardSubtitle", ""],
              ],
              hostAttrs: [1, "mat-card-subtitle"],
            })),
            n
          );
        })(),
        nL = (() => {
          class n {
            constructor(e) {
              this._animationMode = e;
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(g(cr, 8));
            }),
            (n.ɵcmp = Qe({
              type: n,
              selectors: [["mat-card"]],
              hostAttrs: [1, "mat-card", "mat-focus-indicator"],
              hostVars: 2,
              hostBindings: function (e, r) {
                2 & e &&
                  Le(
                    "_mat-animation-noopable",
                    "NoopAnimations" === r._animationMode
                  );
              },
              exportAs: ["matCard"],
              ngContentSelectors: QP,
              decls: 2,
              vars: 0,
              template: function (e, r) {
                1 & e && (wn(KP), Ie(0), Ie(1, 1));
              },
              styles: [
                ".mat-card{transition:box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);display:block;position:relative;padding:16px;border-radius:4px}._mat-animation-noopable.mat-card{transition:none;animation:none}.mat-card .mat-divider-horizontal{position:absolute;left:0;width:100%}[dir=rtl] .mat-card .mat-divider-horizontal{left:auto;right:0}.mat-card .mat-divider-horizontal.mat-divider-inset{position:static;margin:0}[dir=rtl] .mat-card .mat-divider-horizontal.mat-divider-inset{margin-right:0}.cdk-high-contrast-active .mat-card{outline:solid 1px}.mat-card-actions,.mat-card-subtitle,.mat-card-content{display:block;margin-bottom:16px}.mat-card-title{display:block;margin-bottom:8px}.mat-card-actions{margin-left:-8px;margin-right:-8px;padding:8px 0}.mat-card-actions-align-end{display:flex;justify-content:flex-end}.mat-card-image{width:calc(100% + 32px);margin:0 -16px 16px -16px}.mat-card-footer{display:block;margin:0 -16px -16px -16px}.mat-card-actions .mat-button,.mat-card-actions .mat-raised-button,.mat-card-actions .mat-stroked-button{margin:0 8px}.mat-card-header{display:flex;flex-direction:row}.mat-card-header .mat-card-title{margin-bottom:12px}.mat-card-header-text{margin:0 16px}.mat-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;object-fit:cover}.mat-card-title-group{display:flex;justify-content:space-between}.mat-card-sm-image{width:80px;height:80px}.mat-card-md-image{width:112px;height:112px}.mat-card-lg-image{width:152px;height:152px}.mat-card-xl-image{width:240px;height:240px;margin:-8px}.mat-card-title-group>.mat-card-xl-image{margin:-8px 0 8px}@media(max-width: 599px){.mat-card-title-group{margin:0}.mat-card-xl-image{margin-left:0;margin-right:0}}.mat-card>:first-child,.mat-card-content>:first-child{margin-top:0}.mat-card>:last-child:not(.mat-card-footer),.mat-card-content>:last-child:not(.mat-card-footer){margin-bottom:0}.mat-card-image:first-child{margin-top:-16px;border-top-left-radius:inherit;border-top-right-radius:inherit}.mat-card>.mat-card-actions:last-child{margin-bottom:-8px;padding-bottom:0}.mat-card-actions:not(.mat-card-actions-align-end) .mat-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-raised-button:first-child,.mat-card-actions:not(.mat-card-actions-align-end) .mat-stroked-button:first-child{margin-left:0;margin-right:0}.mat-card-actions-align-end .mat-button:last-child,.mat-card-actions-align-end .mat-raised-button:last-child,.mat-card-actions-align-end .mat-stroked-button:last-child{margin-left:0;margin-right:0}.mat-card-title:not(:first-child),.mat-card-subtitle:not(:first-child){margin-top:-4px}.mat-card-header .mat-card-subtitle:not(:first-child){margin-top:-8px}.mat-card>.mat-card-xl-image:first-child{margin-top:-8px}.mat-card>.mat-card-xl-image:last-child{margin-bottom:-8px}\n",
              ],
              encapsulation: 2,
              changeDetection: 0,
            })),
            n
          );
        })(),
        rL = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵcmp = Qe({
              type: n,
              selectors: [["mat-card-title-group"]],
              hostAttrs: [1, "mat-card-title-group"],
              ngContentSelectors: JP,
              decls: 4,
              vars: 0,
              template: function (e, r) {
                1 & e &&
                  (wn(XP), re(0, "div"), Ie(1), ie(), Ie(2, 1), Ie(3, 2));
              },
              encapsulation: 2,
              changeDetection: 0,
            })),
            n
          );
        })(),
        iL = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ imports: [vt, vt] })),
            n
          );
        })();
      function Zh(n, t, e, r) {
        return (
          nr(e) && ((r = e), (e = void 0)),
          r
            ? Zh(n, t, e).pipe(B((i) => (si(i) ? r(...i) : r(i))))
            : new we((i) => {
                rD(
                  n,
                  t,
                  function o(s) {
                    i.next(
                      arguments.length > 1
                        ? Array.prototype.slice.call(arguments)
                        : s
                    );
                  },
                  i,
                  e
                );
              })
        );
      }
      function rD(n, t, e, r, i) {
        let o;
        if (
          (function aL(n) {
            return (
              n &&
              "function" == typeof n.addEventListener &&
              "function" == typeof n.removeEventListener
            );
          })(n)
        ) {
          const s = n;
          n.addEventListener(t, e, i),
            (o = () => s.removeEventListener(t, e, i));
        } else if (
          (function sL(n) {
            return n && "function" == typeof n.on && "function" == typeof n.off;
          })(n)
        ) {
          const s = n;
          n.on(t, e), (o = () => s.off(t, e));
        } else if (
          (function oL(n) {
            return (
              n &&
              "function" == typeof n.addListener &&
              "function" == typeof n.removeListener
            );
          })(n)
        ) {
          const s = n;
          n.addListener(t, e), (o = () => s.removeListener(t, e));
        } else {
          if (!n || !n.length) throw new TypeError("Invalid event target");
          for (let s = 0, a = n.length; s < a; s++) rD(n[s], t, e, r, i);
        }
        r.add(o);
      }
      const oD = kl({ passive: !0 });
      let sD = (() => {
          class n {
            constructor(e, r) {
              (this._platform = e),
                (this._ngZone = r),
                (this._monitoredElements = new Map());
            }
            monitor(e) {
              if (!this._platform.isBrowser) return Gr;
              const r = pr(e),
                i = this._monitoredElements.get(r);
              if (i) return i.subject;
              const o = new He(),
                s = "cdk-text-field-autofilled",
                a = (l) => {
                  "cdk-text-field-autofill-start" !== l.animationName ||
                  r.classList.contains(s)
                    ? "cdk-text-field-autofill-end" === l.animationName &&
                      r.classList.contains(s) &&
                      (r.classList.remove(s),
                      this._ngZone.run(() =>
                        o.next({ target: l.target, isAutofilled: !1 })
                      ))
                    : (r.classList.add(s),
                      this._ngZone.run(() =>
                        o.next({ target: l.target, isAutofilled: !0 })
                      ));
                };
              return (
                this._ngZone.runOutsideAngular(() => {
                  r.addEventListener("animationstart", a, oD),
                    r.classList.add("cdk-text-field-autofill-monitored");
                }),
                this._monitoredElements.set(r, {
                  subject: o,
                  unlisten: () => {
                    r.removeEventListener("animationstart", a, oD);
                  },
                }),
                o
              );
            }
            stopMonitoring(e) {
              const r = pr(e),
                i = this._monitoredElements.get(r);
              i &&
                (i.unlisten(),
                i.subject.complete(),
                r.classList.remove("cdk-text-field-autofill-monitored"),
                r.classList.remove("cdk-text-field-autofilled"),
                this._monitoredElements.delete(r));
            }
            ngOnDestroy() {
              this._monitoredElements.forEach((e, r) => this.stopMonitoring(r));
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(_t), v(K));
            }),
            (n.ɵprov = I({
              factory: function () {
                return new n(v(_t), v(K));
              },
              token: n,
              providedIn: "root",
            })),
            n
          );
        })(),
        aD = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ imports: [Nl] })),
            n
          );
        })();
      function Xh(...n) {
        return (function mL() {
          return ui(1);
        })()(R(...n));
      }
      function Bl(...n) {
        const t = n[n.length - 1];
        return li(t) ? (n.pop(), (e) => Xh(n, e, t)) : (e) => Xh(n, e);
      }
      class lD {}
      class gL {}
      const Wn = "*";
      function yL(n, t) {
        return { type: 7, name: n, definitions: t, options: {} };
      }
      function _L(n, t = null) {
        return { type: 4, styles: t, timings: n };
      }
      function uD(n, t = null) {
        return { type: 2, steps: n, options: t };
      }
      function Hl(n) {
        return { type: 6, styles: n, offset: null };
      }
      function vL(n, t, e) {
        return { type: 0, name: n, styles: t, options: e };
      }
      function bL(n, t, e = null) {
        return { type: 1, expr: n, animation: t, options: e };
      }
      function cD(n) {
        Promise.resolve().then(n);
      }
      class Es {
        constructor(t = 0, e = 0) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this._started = !1),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._position = 0),
            (this.parentPlayer = null),
            (this.totalTime = t + e);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        onStart(t) {
          this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
          this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        hasStarted() {
          return this._started;
        }
        init() {}
        play() {
          this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
            (this._started = !0);
        }
        triggerMicrotask() {
          cD(() => this._onFinish());
        }
        _onStart() {
          this._onStartFns.forEach((t) => t()), (this._onStartFns = []);
        }
        pause() {}
        restart() {}
        finish() {
          this._onFinish();
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this.hasStarted() || this._onStart(),
            this.finish(),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        reset() {
          (this._started = !1),
            (this._finished = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        setPosition(t) {
          this._position = this.totalTime ? t * this.totalTime : 1;
        }
        getPosition() {
          return this.totalTime ? this._position / this.totalTime : 1;
        }
        triggerCallback(t) {
          const e = "start" == t ? this._onStartFns : this._onDoneFns;
          e.forEach((r) => r()), (e.length = 0);
        }
      }
      class dD {
        constructor(t) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._onDestroyFns = []),
            (this.parentPlayer = null),
            (this.totalTime = 0),
            (this.players = t);
          let e = 0,
            r = 0,
            i = 0;
          const o = this.players.length;
          0 == o
            ? cD(() => this._onFinish())
            : this.players.forEach((s) => {
                s.onDone(() => {
                  ++e == o && this._onFinish();
                }),
                  s.onDestroy(() => {
                    ++r == o && this._onDestroy();
                  }),
                  s.onStart(() => {
                    ++i == o && this._onStart();
                  });
              }),
            (this.totalTime = this.players.reduce(
              (s, a) => Math.max(s, a.totalTime),
              0
            ));
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        init() {
          this.players.forEach((t) => t.init());
        }
        onStart(t) {
          this._onStartFns.push(t);
        }
        _onStart() {
          this.hasStarted() ||
            ((this._started = !0),
            this._onStartFns.forEach((t) => t()),
            (this._onStartFns = []));
        }
        onDone(t) {
          this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this.parentPlayer || this.init(),
            this._onStart(),
            this.players.forEach((t) => t.play());
        }
        pause() {
          this.players.forEach((t) => t.pause());
        }
        restart() {
          this.players.forEach((t) => t.restart());
        }
        finish() {
          this._onFinish(), this.players.forEach((t) => t.finish());
        }
        destroy() {
          this._onDestroy();
        }
        _onDestroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._onFinish(),
            this.players.forEach((t) => t.destroy()),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        reset() {
          this.players.forEach((t) => t.reset()),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1);
        }
        setPosition(t) {
          const e = t * this.totalTime;
          this.players.forEach((r) => {
            const i = r.totalTime ? Math.min(1, e / r.totalTime) : 1;
            r.setPosition(i);
          });
        }
        getPosition() {
          const t = this.players.reduce(
            (e, r) => (null === e || r.totalTime > e.totalTime ? r : e),
            null
          );
          return null != t ? t.getPosition() : 0;
        }
        beforeDestroy() {
          this.players.forEach((t) => {
            t.beforeDestroy && t.beforeDestroy();
          });
        }
        triggerCallback(t) {
          const e = "start" == t ? this._onStartFns : this._onDoneFns;
          e.forEach((r) => r()), (e.length = 0);
        }
      }
      const CL = ["underline"],
        DL = ["connectionContainer"],
        EL = ["inputContainer"],
        wL = ["label"];
      function ML(n, t) {
        1 & n &&
          (Xo(0),
          re(1, "div", 14),
          kt(2, "div", 15)(3, "div", 16)(4, "div", 17),
          ie(),
          re(5, "div", 18),
          kt(6, "div", 15)(7, "div", 16)(8, "div", 17),
          ie(),
          Jo());
      }
      function SL(n, t) {
        1 & n && (re(0, "div", 19), Ie(1, 1), ie());
      }
      function AL(n, t) {
        if (
          (1 & n && (Xo(0), Ie(1, 2), re(2, "span"), cn(3), ie(), Jo()), 2 & n)
        ) {
          const e = an(2);
          _e(3), Hr(e._control.placeholder);
        }
      }
      function IL(n, t) {
        1 & n && Ie(0, 3, ["*ngSwitchCase", "true"]);
      }
      function TL(n, t) {
        1 & n && (re(0, "span", 23), cn(1, " *"), ie());
      }
      function FL(n, t) {
        if (1 & n) {
          const e = (function Uy() {
            return C();
          })();
          re(0, "label", 20, 21),
            ke("cdkObserveContent", function () {
              return (
                (function cm(n) {
                  return (U.lFrame.contextLView = n), n[8];
                })(e),
                (function dm(n) {
                  return (U.lFrame.contextLView = null), n;
                })(an().updateOutlineGap())
              );
            }),
            mt(2, AL, 4, 1, "ng-container", 12),
            mt(3, IL, 1, 0, "ng-content", 12),
            mt(4, TL, 2, 0, "span", 22),
            ie();
        }
        if (2 & n) {
          const e = an();
          Le("mat-empty", e._control.empty && !e._shouldAlwaysFloat())(
            "mat-form-field-empty",
            e._control.empty && !e._shouldAlwaysFloat()
          )("mat-accent", "accent" == e.color)("mat-warn", "warn" == e.color),
            ge("cdkObserveContentDisabled", "outline" != e.appearance)(
              "id",
              e._labelId
            )("ngSwitch", e._hasLabel()),
            Pe("for", e._control.id)("aria-owns", e._control.id),
            _e(2),
            ge("ngSwitchCase", !1),
            _e(1),
            ge("ngSwitchCase", !0),
            _e(1),
            ge(
              "ngIf",
              !e.hideRequiredMarker &&
                e._control.required &&
                !e._control.disabled
            );
        }
      }
      function xL(n, t) {
        1 & n && (re(0, "div", 24), Ie(1, 4), ie());
      }
      function RL(n, t) {
        if ((1 & n && (re(0, "div", 25, 26), kt(2, "span", 27), ie()), 2 & n)) {
          const e = an();
          _e(2),
            Le("mat-accent", "accent" == e.color)(
              "mat-warn",
              "warn" == e.color
            );
        }
      }
      function NL(n, t) {
        1 & n && (re(0, "div"), Ie(1, 5), ie()),
          2 & n && ge("@transitionMessages", an()._subscriptAnimationState);
      }
      function kL(n, t) {
        if ((1 & n && (re(0, "div", 31), cn(1), ie()), 2 & n)) {
          const e = an(2);
          ge("id", e._hintLabelId), _e(1), Hr(e.hintLabel);
        }
      }
      function OL(n, t) {
        if (
          (1 & n &&
            (re(0, "div", 28),
            mt(1, kL, 2, 2, "div", 29),
            Ie(2, 6),
            kt(3, "div", 30),
            Ie(4, 7),
            ie()),
          2 & n)
        ) {
          const e = an();
          ge("@transitionMessages", e._subscriptAnimationState),
            _e(1),
            ge("ngIf", e.hintLabel);
        }
      }
      const PL = [
          "*",
          [["", "matPrefix", ""]],
          [["mat-placeholder"]],
          [["mat-label"]],
          [["", "matSuffix", ""]],
          [["mat-error"]],
          [["mat-hint", 3, "align", "end"]],
          [["mat-hint", "align", "end"]],
        ],
        LL = [
          "*",
          "[matPrefix]",
          "mat-placeholder",
          "mat-label",
          "[matSuffix]",
          "mat-error",
          "mat-hint:not([align='end'])",
          "mat-hint[align='end']",
        ];
      let VL = 0;
      const hD = new w("MatError");
      let BL = (() => {
        class n {
          constructor(e, r) {
            (this.id = "mat-error-" + VL++),
              e || r.nativeElement.setAttribute("aria-live", "polite");
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(
              (function bi(n) {
                return (function bA(n, t) {
                  if ("class" === t) return n.classes;
                  if ("style" === t) return n.styles;
                  const e = n.attrs;
                  if (e) {
                    const r = e.length;
                    let i = 0;
                    for (; i < r; ) {
                      const o = e[i];
                      if (Em(o)) break;
                      if (0 === o) i += 2;
                      else if ("number" == typeof o)
                        for (i++; i < r && "string" == typeof e[i]; ) i++;
                      else {
                        if (o === t) return e[i + 1];
                        i += 2;
                      }
                    }
                  }
                  return null;
                })(Ze(), n);
              })("aria-live"),
              g(fe)
            );
          }),
          (n.ɵdir = M({
            type: n,
            selectors: [["mat-error"]],
            hostAttrs: ["aria-atomic", "true", 1, "mat-error"],
            hostVars: 1,
            hostBindings: function (e, r) {
              2 & e && Pe("id", r.id);
            },
            inputs: { id: "id" },
            features: [oe([{ provide: hD, useExisting: n }])],
          })),
          n
        );
      })();
      const HL = {
        transitionMessages: yL("transitionMessages", [
          vL("enter", Hl({ opacity: 1, transform: "translateY(0%)" })),
          bL("void => enter", [
            Hl({ opacity: 0, transform: "translateY(-5px)" }),
            _L("300ms cubic-bezier(0.55, 0, 0.55, 0.2)"),
          ]),
        ]),
      };
      let ef = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵdir = M({ type: n })),
          n
        );
      })();
      const fD = new w("MatHint");
      let tf = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵdir = M({ type: n, selectors: [["mat-label"]] })),
            n
          );
        })(),
        jL = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵdir = M({ type: n, selectors: [["mat-placeholder"]] })),
            n
          );
        })();
      const pD = new w("MatPrefix"),
        mD = new w("MatSuffix");
      let gD = 0;
      const zL = Qh(
          class {
            constructor(n) {
              this._elementRef = n;
            }
          },
          "primary"
        ),
        GL = new w("MAT_FORM_FIELD_DEFAULT_OPTIONS"),
        _D = new w("MatFormField");
      let qL = (() => {
          class n extends zL {
            constructor(e, r, i, o, s, a, l, u) {
              super(e),
                (this._changeDetectorRef = r),
                (this._dir = o),
                (this._defaults = s),
                (this._platform = a),
                (this._ngZone = l),
                (this._outlineGapCalculationNeededImmediately = !1),
                (this._outlineGapCalculationNeededOnStable = !1),
                (this._destroyed = new He()),
                (this._showAlwaysAnimate = !1),
                (this._subscriptAnimationState = ""),
                (this._hintLabel = ""),
                (this._hintLabelId = "mat-hint-" + gD++),
                (this._labelId = "mat-form-field-label-" + gD++),
                (this.floatLabel = this._getDefaultFloatLabelState()),
                (this._animationsEnabled = "NoopAnimations" !== u),
                (this.appearance = s && s.appearance ? s.appearance : "legacy"),
                (this._hideRequiredMarker =
                  !(!s || null == s.hideRequiredMarker) &&
                  s.hideRequiredMarker);
            }
            get appearance() {
              return this._appearance;
            }
            set appearance(e) {
              const r = this._appearance;
              (this._appearance =
                e || (this._defaults && this._defaults.appearance) || "legacy"),
                "outline" === this._appearance &&
                  r !== e &&
                  (this._outlineGapCalculationNeededOnStable = !0);
            }
            get hideRequiredMarker() {
              return this._hideRequiredMarker;
            }
            set hideRequiredMarker(e) {
              this._hideRequiredMarker = Qt(e);
            }
            _shouldAlwaysFloat() {
              return "always" === this.floatLabel && !this._showAlwaysAnimate;
            }
            _canLabelFloat() {
              return "never" !== this.floatLabel;
            }
            get hintLabel() {
              return this._hintLabel;
            }
            set hintLabel(e) {
              (this._hintLabel = e), this._processHints();
            }
            get floatLabel() {
              return "legacy" !== this.appearance &&
                "never" === this._floatLabel
                ? "auto"
                : this._floatLabel;
            }
            set floatLabel(e) {
              e !== this._floatLabel &&
                ((this._floatLabel = e || this._getDefaultFloatLabelState()),
                this._changeDetectorRef.markForCheck());
            }
            get _control() {
              return (
                this._explicitFormFieldControl ||
                this._controlNonStatic ||
                this._controlStatic
              );
            }
            set _control(e) {
              this._explicitFormFieldControl = e;
            }
            getLabelId() {
              return this._hasFloatingLabel() ? this._labelId : null;
            }
            getConnectedOverlayOrigin() {
              return this._connectionContainerRef || this._elementRef;
            }
            ngAfterContentInit() {
              this._validateControlChild();
              const e = this._control;
              e.controlType &&
                this._elementRef.nativeElement.classList.add(
                  `mat-form-field-type-${e.controlType}`
                ),
                e.stateChanges.pipe(Bl(null)).subscribe(() => {
                  this._validatePlaceholders(),
                    this._syncDescribedByIds(),
                    this._changeDetectorRef.markForCheck();
                }),
                e.ngControl &&
                  e.ngControl.valueChanges &&
                  e.ngControl.valueChanges
                    .pipe(vs(this._destroyed))
                    .subscribe(() => this._changeDetectorRef.markForCheck()),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable
                    .pipe(vs(this._destroyed))
                    .subscribe(() => {
                      this._outlineGapCalculationNeededOnStable &&
                        this.updateOutlineGap();
                    });
                }),
                Vp(
                  this._prefixChildren.changes,
                  this._suffixChildren.changes
                ).subscribe(() => {
                  (this._outlineGapCalculationNeededOnStable = !0),
                    this._changeDetectorRef.markForCheck();
                }),
                this._hintChildren.changes.pipe(Bl(null)).subscribe(() => {
                  this._processHints(), this._changeDetectorRef.markForCheck();
                }),
                this._errorChildren.changes.pipe(Bl(null)).subscribe(() => {
                  this._syncDescribedByIds(),
                    this._changeDetectorRef.markForCheck();
                }),
                this._dir &&
                  this._dir.change.pipe(vs(this._destroyed)).subscribe(() => {
                    "function" == typeof requestAnimationFrame
                      ? this._ngZone.runOutsideAngular(() => {
                          requestAnimationFrame(() => this.updateOutlineGap());
                        })
                      : this.updateOutlineGap();
                  });
            }
            ngAfterContentChecked() {
              this._validateControlChild(),
                this._outlineGapCalculationNeededImmediately &&
                  this.updateOutlineGap();
            }
            ngAfterViewInit() {
              (this._subscriptAnimationState = "enter"),
                this._changeDetectorRef.detectChanges();
            }
            ngOnDestroy() {
              this._destroyed.next(), this._destroyed.complete();
            }
            _shouldForward(e) {
              const r = this._control ? this._control.ngControl : null;
              return r && r[e];
            }
            _hasPlaceholder() {
              return !!(
                (this._control && this._control.placeholder) ||
                this._placeholderChild
              );
            }
            _hasLabel() {
              return !(!this._labelChildNonStatic && !this._labelChildStatic);
            }
            _shouldLabelFloat() {
              return (
                this._canLabelFloat() &&
                ((this._control && this._control.shouldLabelFloat) ||
                  this._shouldAlwaysFloat())
              );
            }
            _hideControlPlaceholder() {
              return (
                ("legacy" === this.appearance && !this._hasLabel()) ||
                (this._hasLabel() && !this._shouldLabelFloat())
              );
            }
            _hasFloatingLabel() {
              return (
                this._hasLabel() ||
                ("legacy" === this.appearance && this._hasPlaceholder())
              );
            }
            _getDisplayedMessages() {
              return this._errorChildren &&
                this._errorChildren.length > 0 &&
                this._control.errorState
                ? "error"
                : "hint";
            }
            _animateAndLockLabel() {
              this._hasFloatingLabel() &&
                this._canLabelFloat() &&
                (this._animationsEnabled &&
                  this._label &&
                  ((this._showAlwaysAnimate = !0),
                  Zh(this._label.nativeElement, "transitionend")
                    .pipe(fr(1))
                    .subscribe(() => {
                      this._showAlwaysAnimate = !1;
                    })),
                (this.floatLabel = "always"),
                this._changeDetectorRef.markForCheck());
            }
            _validatePlaceholders() {}
            _processHints() {
              this._validateHints(), this._syncDescribedByIds();
            }
            _validateHints() {}
            _getDefaultFloatLabelState() {
              return (this._defaults && this._defaults.floatLabel) || "auto";
            }
            _syncDescribedByIds() {
              if (this._control) {
                let e = [];
                if (
                  (this._control.userAriaDescribedBy &&
                    "string" == typeof this._control.userAriaDescribedBy &&
                    e.push(...this._control.userAriaDescribedBy.split(" ")),
                  "hint" === this._getDisplayedMessages())
                ) {
                  const r = this._hintChildren
                      ? this._hintChildren.find((o) => "start" === o.align)
                      : null,
                    i = this._hintChildren
                      ? this._hintChildren.find((o) => "end" === o.align)
                      : null;
                  r
                    ? e.push(r.id)
                    : this._hintLabel && e.push(this._hintLabelId),
                    i && e.push(i.id);
                } else
                  this._errorChildren &&
                    e.push(...this._errorChildren.map((r) => r.id));
                this._control.setDescribedByIds(e);
              }
            }
            _validateControlChild() {}
            updateOutlineGap() {
              const e = this._label ? this._label.nativeElement : null;
              if (
                !(
                  "outline" === this.appearance &&
                  e &&
                  e.children.length &&
                  e.textContent.trim() &&
                  this._platform.isBrowser
                )
              )
                return;
              if (!this._isAttachedToDOM())
                return void (this._outlineGapCalculationNeededImmediately = !0);
              let r = 0,
                i = 0;
              const o = this._connectionContainerRef.nativeElement,
                s = o.querySelectorAll(".mat-form-field-outline-start"),
                a = o.querySelectorAll(".mat-form-field-outline-gap");
              if (this._label && this._label.nativeElement.children.length) {
                const l = o.getBoundingClientRect();
                if (0 === l.width && 0 === l.height)
                  return (
                    (this._outlineGapCalculationNeededOnStable = !0),
                    void (this._outlineGapCalculationNeededImmediately = !1)
                  );
                const u = this._getStartEnd(l),
                  c = e.children,
                  d = this._getStartEnd(c[0].getBoundingClientRect());
                let h = 0;
                for (let f = 0; f < c.length; f++) h += c[f].offsetWidth;
                (r = Math.abs(d - u) - 5), (i = h > 0 ? 0.75 * h + 10 : 0);
              }
              for (let l = 0; l < s.length; l++) s[l].style.width = `${r}px`;
              for (let l = 0; l < a.length; l++) a[l].style.width = `${i}px`;
              this._outlineGapCalculationNeededOnStable =
                this._outlineGapCalculationNeededImmediately = !1;
            }
            _getStartEnd(e) {
              return this._dir && "rtl" === this._dir.value ? e.right : e.left;
            }
            _isAttachedToDOM() {
              const e = this._elementRef.nativeElement;
              if (e.getRootNode) {
                const r = e.getRootNode();
                return r && r !== e;
              }
              return document.documentElement.contains(e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(
                g(fe),
                g(jr),
                g(fe),
                g($C, 8),
                g(GL, 8),
                g(_t),
                g(K),
                g(cr, 8)
              );
            }),
            (n.ɵcmp = Qe({
              type: n,
              selectors: [["mat-form-field"]],
              contentQueries: function (e, r, i) {
                if (
                  (1 & e &&
                    (hn(i, ef, 5),
                    hn(i, ef, 7),
                    hn(i, tf, 5),
                    hn(i, tf, 7),
                    hn(i, jL, 5),
                    hn(i, hD, 5),
                    hn(i, fD, 5),
                    hn(i, pD, 5),
                    hn(i, mD, 5)),
                  2 & e)
                ) {
                  let o;
                  st((o = at())) && (r._controlNonStatic = o.first),
                    st((o = at())) && (r._controlStatic = o.first),
                    st((o = at())) && (r._labelChildNonStatic = o.first),
                    st((o = at())) && (r._labelChildStatic = o.first),
                    st((o = at())) && (r._placeholderChild = o.first),
                    st((o = at())) && (r._errorChildren = o),
                    st((o = at())) && (r._hintChildren = o),
                    st((o = at())) && (r._prefixChildren = o),
                    st((o = at())) && (r._suffixChildren = o);
                }
              },
              viewQuery: function (e, r) {
                if (
                  (1 & e && (Wi(CL, 5), Wi(DL, 7), Wi(EL, 5), Wi(wL, 5)), 2 & e)
                ) {
                  let i;
                  st((i = at())) && (r.underlineRef = i.first),
                    st((i = at())) && (r._connectionContainerRef = i.first),
                    st((i = at())) && (r._inputContainerRef = i.first),
                    st((i = at())) && (r._label = i.first);
                }
              },
              hostAttrs: [1, "mat-form-field"],
              hostVars: 40,
              hostBindings: function (e, r) {
                2 & e &&
                  Le(
                    "mat-form-field-appearance-standard",
                    "standard" == r.appearance
                  )("mat-form-field-appearance-fill", "fill" == r.appearance)(
                    "mat-form-field-appearance-outline",
                    "outline" == r.appearance
                  )(
                    "mat-form-field-appearance-legacy",
                    "legacy" == r.appearance
                  )("mat-form-field-invalid", r._control.errorState)(
                    "mat-form-field-can-float",
                    r._canLabelFloat()
                  )("mat-form-field-should-float", r._shouldLabelFloat())(
                    "mat-form-field-has-label",
                    r._hasFloatingLabel()
                  )(
                    "mat-form-field-hide-placeholder",
                    r._hideControlPlaceholder()
                  )("mat-form-field-disabled", r._control.disabled)(
                    "mat-form-field-autofilled",
                    r._control.autofilled
                  )("mat-focused", r._control.focused)(
                    "ng-untouched",
                    r._shouldForward("untouched")
                  )("ng-touched", r._shouldForward("touched"))(
                    "ng-pristine",
                    r._shouldForward("pristine")
                  )("ng-dirty", r._shouldForward("dirty"))(
                    "ng-valid",
                    r._shouldForward("valid")
                  )("ng-invalid", r._shouldForward("invalid"))(
                    "ng-pending",
                    r._shouldForward("pending")
                  )("_mat-animation-noopable", !r._animationsEnabled);
              },
              inputs: {
                color: "color",
                floatLabel: "floatLabel",
                appearance: "appearance",
                hideRequiredMarker: "hideRequiredMarker",
                hintLabel: "hintLabel",
              },
              exportAs: ["matFormField"],
              features: [oe([{ provide: _D, useExisting: n }]), W],
              ngContentSelectors: LL,
              decls: 15,
              vars: 8,
              consts: [
                [1, "mat-form-field-wrapper"],
                [1, "mat-form-field-flex", 3, "click"],
                ["connectionContainer", ""],
                [4, "ngIf"],
                ["class", "mat-form-field-prefix", 4, "ngIf"],
                [1, "mat-form-field-infix"],
                ["inputContainer", ""],
                [1, "mat-form-field-label-wrapper"],
                [
                  "class",
                  "mat-form-field-label",
                  3,
                  "cdkObserveContentDisabled",
                  "id",
                  "mat-empty",
                  "mat-form-field-empty",
                  "mat-accent",
                  "mat-warn",
                  "ngSwitch",
                  "cdkObserveContent",
                  4,
                  "ngIf",
                ],
                ["class", "mat-form-field-suffix", 4, "ngIf"],
                ["class", "mat-form-field-underline", 4, "ngIf"],
                [1, "mat-form-field-subscript-wrapper", 3, "ngSwitch"],
                [4, "ngSwitchCase"],
                ["class", "mat-form-field-hint-wrapper", 4, "ngSwitchCase"],
                [1, "mat-form-field-outline"],
                [1, "mat-form-field-outline-start"],
                [1, "mat-form-field-outline-gap"],
                [1, "mat-form-field-outline-end"],
                [1, "mat-form-field-outline", "mat-form-field-outline-thick"],
                [1, "mat-form-field-prefix"],
                [
                  1,
                  "mat-form-field-label",
                  3,
                  "cdkObserveContentDisabled",
                  "id",
                  "ngSwitch",
                  "cdkObserveContent",
                ],
                ["label", ""],
                [
                  "class",
                  "mat-placeholder-required mat-form-field-required-marker",
                  "aria-hidden",
                  "true",
                  4,
                  "ngIf",
                ],
                [
                  "aria-hidden",
                  "true",
                  1,
                  "mat-placeholder-required",
                  "mat-form-field-required-marker",
                ],
                [1, "mat-form-field-suffix"],
                [1, "mat-form-field-underline"],
                ["underline", ""],
                [1, "mat-form-field-ripple"],
                [1, "mat-form-field-hint-wrapper"],
                ["class", "mat-hint", 3, "id", 4, "ngIf"],
                [1, "mat-form-field-hint-spacer"],
                [1, "mat-hint", 3, "id"],
              ],
              template: function (e, r) {
                1 & e &&
                  (wn(PL),
                  re(0, "div", 0)(1, "div", 1, 2),
                  ke("click", function (o) {
                    return (
                      r._control.onContainerClick &&
                      r._control.onContainerClick(o)
                    );
                  }),
                  mt(3, ML, 9, 0, "ng-container", 3),
                  mt(4, SL, 2, 0, "div", 4),
                  re(5, "div", 5, 6),
                  Ie(7),
                  re(8, "span", 7),
                  mt(9, FL, 5, 16, "label", 8),
                  ie()(),
                  mt(10, xL, 2, 0, "div", 9),
                  ie(),
                  mt(11, RL, 3, 4, "div", 10),
                  re(12, "div", 11),
                  mt(13, NL, 2, 1, "div", 12),
                  mt(14, OL, 5, 2, "div", 13),
                  ie()()),
                  2 & e &&
                    (_e(3),
                    ge("ngIf", "outline" == r.appearance),
                    _e(1),
                    ge("ngIf", r._prefixChildren.length),
                    _e(5),
                    ge("ngIf", r._hasFloatingLabel()),
                    _e(1),
                    ge("ngIf", r._suffixChildren.length),
                    _e(1),
                    ge("ngIf", "outline" != r.appearance),
                    _e(1),
                    ge("ngSwitch", r._getDisplayedMessages()),
                    _e(1),
                    ge("ngSwitchCase", "error"),
                    _e(1),
                    ge("ngSwitchCase", "hint"));
              },
              dependencies: [Ml, Sl, $b, q1],
              styles: [
                ".mat-form-field{display:inline-block;position:relative;text-align:left}[dir=rtl] .mat-form-field{text-align:right}.mat-form-field-wrapper{position:relative}.mat-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-form-field-prefix,.mat-form-field-suffix{white-space:nowrap;flex:none;position:relative}.mat-form-field-infix{display:block;position:relative;flex:auto;min-width:0;width:180px}.cdk-high-contrast-active .mat-form-field-infix{border-image:linear-gradient(transparent, transparent)}.mat-form-field-label-wrapper{position:absolute;left:0;box-sizing:content-box;width:100%;height:100%;overflow:hidden;pointer-events:none}[dir=rtl] .mat-form-field-label-wrapper{left:auto;right:0}.mat-form-field-label{position:absolute;left:0;font:inherit;pointer-events:none;width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;transform-origin:0 0;transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1),color 400ms cubic-bezier(0.25, 0.8, 0.25, 1),width 400ms cubic-bezier(0.25, 0.8, 0.25, 1);display:none}[dir=rtl] .mat-form-field-label{transform-origin:100% 0;left:auto;right:0}.mat-form-field-empty.mat-form-field-label,.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-label{display:block}.mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-form-field-autofill-control:-webkit-autofill+.mat-form-field-label-wrapper .mat-form-field-label{display:block;transition:none}.mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:none}.mat-form-field-can-float .mat-input-server:focus+.mat-form-field-label-wrapper .mat-form-field-label,.mat-form-field-can-float .mat-input-server[placeholder]:not(:placeholder-shown)+.mat-form-field-label-wrapper .mat-form-field-label{display:block}.mat-form-field-label:not(.mat-form-field-empty){transition:none}.mat-form-field-underline{position:absolute;width:100%;pointer-events:none;transform:scale3d(1, 1.0001, 1)}.mat-form-field-ripple{position:absolute;left:0;width:100%;transform-origin:50%;transform:scaleX(0.5);opacity:0;transition:background-color 300ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-form-field.mat-focused .mat-form-field-ripple,.mat-form-field.mat-form-field-invalid .mat-form-field-ripple{opacity:1;transform:none;transition:transform 300ms cubic-bezier(0.25, 0.8, 0.25, 1),opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1),background-color 300ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-subscript-wrapper{position:absolute;box-sizing:border-box;width:100%;overflow:hidden}.mat-form-field-subscript-wrapper .mat-icon,.mat-form-field-label-wrapper .mat-icon{width:1em;height:1em;font-size:inherit;vertical-align:baseline}.mat-form-field-hint-wrapper{display:flex}.mat-form-field-hint-spacer{flex:1 0 1em}.mat-error{display:block}.mat-form-field-control-wrapper{position:relative}.mat-form-field-hint-end{order:1}.mat-form-field._mat-animation-noopable .mat-form-field-label,.mat-form-field._mat-animation-noopable .mat-form-field-ripple{transition:none}\n",
                '.mat-form-field-appearance-fill .mat-form-field-flex{border-radius:4px 4px 0 0;padding:.75em .75em 0 .75em}.cdk-high-contrast-active .mat-form-field-appearance-fill .mat-form-field-flex{outline:solid 1px}.cdk-high-contrast-active .mat-form-field-appearance-fill.mat-focused .mat-form-field-flex{outline:dashed 3px}.mat-form-field-appearance-fill .mat-form-field-underline::before{content:"";display:block;position:absolute;bottom:0;height:1px;width:100%}.mat-form-field-appearance-fill .mat-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .mat-form-field-appearance-fill .mat-form-field-ripple{height:0}.mat-form-field-appearance-fill:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-fill._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}.mat-form-field-appearance-fill .mat-form-field-subscript-wrapper{padding:0 1em}\n',
                '.mat-input-element{font:inherit;background:transparent;color:currentColor;border:none;outline:none;padding:0;margin:0;width:100%;max-width:100%;vertical-align:bottom;text-align:inherit;box-sizing:content-box}.mat-input-element:-moz-ui-invalid{box-shadow:none}.mat-input-element::-ms-clear,.mat-input-element::-ms-reveal{display:none}.mat-input-element,.mat-input-element::-webkit-search-cancel-button,.mat-input-element::-webkit-search-decoration,.mat-input-element::-webkit-search-results-button,.mat-input-element::-webkit-search-results-decoration{-webkit-appearance:none}.mat-input-element::-webkit-contacts-auto-fill-button,.mat-input-element::-webkit-caps-lock-indicator,.mat-input-element:not([type=password])::-webkit-credentials-auto-fill-button{visibility:hidden}.mat-input-element[type=date],.mat-input-element[type=datetime],.mat-input-element[type=datetime-local],.mat-input-element[type=month],.mat-input-element[type=week],.mat-input-element[type=time]{line-height:1}.mat-input-element[type=date]::after,.mat-input-element[type=datetime]::after,.mat-input-element[type=datetime-local]::after,.mat-input-element[type=month]::after,.mat-input-element[type=week]::after,.mat-input-element[type=time]::after{content:" ";white-space:pre;width:1px}.mat-input-element::-webkit-inner-spin-button,.mat-input-element::-webkit-calendar-picker-indicator,.mat-input-element::-webkit-clear-button{font-size:.75em}.mat-input-element::placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-moz-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-moz-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element::-webkit-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element::-webkit-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-input-element:-ms-input-placeholder{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-input-element:-ms-input-placeholder:-ms-input-placeholder{-ms-user-select:text}.mat-form-field-hide-placeholder .mat-input-element::placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element::placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element::-moz-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element::-webkit-input-placeholder{opacity:0}.mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{color:transparent !important;-webkit-text-fill-color:transparent;transition:none}.cdk-high-contrast-active .mat-form-field-hide-placeholder .mat-input-element:-ms-input-placeholder{opacity:0}textarea.mat-input-element{resize:vertical;overflow:auto}textarea.mat-input-element.cdk-textarea-autosize{resize:none}textarea.mat-input-element{padding:2px 0;margin:-2px 0}select.mat-input-element{-moz-appearance:none;-webkit-appearance:none;position:relative;background-color:transparent;display:inline-flex;box-sizing:border-box;padding-top:1em;top:-1em;margin-bottom:-1em}select.mat-input-element::-ms-expand{display:none}select.mat-input-element::-moz-focus-inner{border:0}select.mat-input-element:not(:disabled){cursor:pointer}select.mat-input-element::-ms-value{color:inherit;background:none}.mat-focused .cdk-high-contrast-active select.mat-input-element::-ms-value{color:inherit}.mat-form-field-type-mat-native-select .mat-form-field-infix::after{content:"";width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid;position:absolute;top:50%;right:0;margin-top:-2.5px;pointer-events:none}[dir=rtl] .mat-form-field-type-mat-native-select .mat-form-field-infix::after{right:auto;left:0}.mat-form-field-type-mat-native-select .mat-input-element{padding-right:15px}[dir=rtl] .mat-form-field-type-mat-native-select .mat-input-element{padding-right:0;padding-left:15px}.mat-form-field-type-mat-native-select .mat-form-field-label-wrapper{max-width:calc(100% - 10px)}.mat-form-field-type-mat-native-select.mat-form-field-appearance-outline .mat-form-field-infix::after{margin-top:-5px}.mat-form-field-type-mat-native-select.mat-form-field-appearance-fill .mat-form-field-infix::after{margin-top:-10px}\n',
                ".mat-form-field-appearance-legacy .mat-form-field-label{transform:perspective(100px);-ms-transform:none}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon{width:1em}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button{font:inherit;vertical-align:baseline}.mat-form-field-appearance-legacy .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-icon-button .mat-icon{font-size:inherit}.mat-form-field-appearance-legacy .mat-form-field-underline{height:1px}.cdk-high-contrast-active .mat-form-field-appearance-legacy .mat-form-field-underline{height:0;border-top:solid 1px}.mat-form-field-appearance-legacy .mat-form-field-ripple{top:0;height:2px;overflow:hidden}.cdk-high-contrast-active .mat-form-field-appearance-legacy .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.cdk-high-contrast-active .mat-form-field-appearance-legacy.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}.mat-form-field-appearance-legacy.mat-form-field-invalid:not(.mat-focused) .mat-form-field-ripple{height:1px}\n",
                ".mat-form-field-appearance-outline .mat-form-field-wrapper{margin:.25em 0}.mat-form-field-appearance-outline .mat-form-field-flex{padding:0 .75em 0 .75em;margin-top:-0.25em;position:relative}.mat-form-field-appearance-outline .mat-form-field-prefix,.mat-form-field-appearance-outline .mat-form-field-suffix{top:.25em}.mat-form-field-appearance-outline .mat-form-field-outline{display:flex;position:absolute;top:.25em;left:0;right:0;bottom:0;pointer-events:none}.mat-form-field-appearance-outline .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-end{border:1px solid currentColor;min-width:5px}.mat-form-field-appearance-outline .mat-form-field-outline-start{border-radius:5px 0 0 5px;border-right-style:none}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-start{border-right-style:solid;border-left-style:none;border-radius:0 5px 5px 0}.mat-form-field-appearance-outline .mat-form-field-outline-end{border-radius:0 5px 5px 0;border-left-style:none;flex-grow:1}[dir=rtl] .mat-form-field-appearance-outline .mat-form-field-outline-end{border-left-style:solid;border-right-style:none;border-radius:5px 0 0 5px}.mat-form-field-appearance-outline .mat-form-field-outline-gap{border-radius:.000001px;border:1px solid currentColor;border-left-style:none;border-right-style:none}.mat-form-field-appearance-outline.mat-form-field-can-float.mat-form-field-should-float .mat-form-field-outline-gap{border-top-color:transparent}.mat-form-field-appearance-outline .mat-form-field-outline-thick{opacity:0}.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-start,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-end,.mat-form-field-appearance-outline .mat-form-field-outline-thick .mat-form-field-outline-gap{border-width:2px}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline{opacity:0;transition:opacity 100ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick,.mat-form-field-appearance-outline.mat-form-field-invalid .mat-form-field-outline-thick{opacity:1}.cdk-high-contrast-active .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick{border:3px dashed}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline{opacity:0;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-outline:not(.mat-form-field-disabled) .mat-form-field-flex:hover .mat-form-field-outline-thick{opacity:1}.mat-form-field-appearance-outline .mat-form-field-subscript-wrapper{padding:0 1em}.mat-form-field-appearance-outline._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-start,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-end,.mat-form-field-appearance-outline._mat-animation-noopable .mat-form-field-outline-gap{transition:none}\n",
                ".mat-form-field-appearance-standard .mat-form-field-flex{padding-top:.75em}.mat-form-field-appearance-standard .mat-form-field-underline{height:1px}.cdk-high-contrast-active .mat-form-field-appearance-standard .mat-form-field-underline{height:0;border-top:solid 1px}.mat-form-field-appearance-standard .mat-form-field-ripple{bottom:0;height:2px}.cdk-high-contrast-active .mat-form-field-appearance-standard .mat-form-field-ripple{height:0;border-top:solid 2px}.mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{background-position:0;background-color:transparent}.cdk-high-contrast-active .mat-form-field-appearance-standard.mat-form-field-disabled .mat-form-field-underline{border-top-style:dotted;border-top-width:2px}.mat-form-field-appearance-standard:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{opacity:1;transform:none;transition:opacity 600ms cubic-bezier(0.25, 0.8, 0.25, 1)}.mat-form-field-appearance-standard._mat-animation-noopable:not(.mat-form-field-disabled) .mat-form-field-flex:hover~.mat-form-field-underline .mat-form-field-ripple{transition:none}\n",
              ],
              encapsulation: 2,
              data: { animation: [HL.transitionMessages] },
              changeDetection: 0,
            })),
            n
          );
        })(),
        nf = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ imports: [xh, vt, MC, vt] })),
            n
          );
        })();
      function Ul(n, t) {
        return new we((e) => {
          const r = n.length;
          if (0 === r) return void e.complete();
          const i = new Array(r);
          let o = 0,
            s = 0;
          for (let a = 0; a < r; a++) {
            const l = Ue(n[a]);
            let u = !1;
            e.add(
              l.subscribe({
                next: (c) => {
                  u || ((u = !0), s++), (i[a] = c);
                },
                error: (c) => e.error(c),
                complete: () => {
                  o++,
                    (o === r || !u) &&
                      (s === r &&
                        e.next(
                          t ? t.reduce((c, d, h) => ((c[d] = i[h]), c), {}) : i
                        ),
                      e.complete());
                },
              })
            );
          }
        });
      }
      let bD = (() => {
          class n {
            constructor(e, r) {
              (this._renderer = e),
                (this._elementRef = r),
                (this.onChange = (i) => {}),
                (this.onTouched = () => {});
            }
            setProperty(e, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, e, r);
            }
            registerOnTouched(e) {
              this.onTouched = e;
            }
            registerOnChange(e) {
              this.onChange = e;
            }
            setDisabledState(e) {
              this.setProperty("disabled", e);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(g(Hn), g(fe));
            }),
            (n.ɵdir = M({ type: n })),
            n
          );
        })(),
        Kr = (() => {
          class n extends bD {}
          return (
            (n.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = je(n)))(r || n);
              };
            })()),
            (n.ɵdir = M({ type: n, features: [W] })),
            n
          );
        })();
      const Tn = new w("NgValueAccessor"),
        KL = { provide: Tn, useExisting: Ce(() => jl), multi: !0 },
        YL = new w("CompositionEventMode");
      let jl = (() => {
        class n extends bD {
          constructor(e, r, i) {
            super(e, r),
              (this._compositionMode = i),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function QL() {
                  const n = In() ? In().getUserAgent() : "";
                  return /android (\d+)/.test(n.toLowerCase());
                })());
          }
          writeValue(e) {
            this.setProperty("value", e ?? "");
          }
          _handleInput(e) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(e);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(e) {
            (this._composing = !1), this._compositionMode && this.onChange(e);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(g(Hn), g(fe), g(YL, 8));
          }),
          (n.ɵdir = M({
            type: n,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (e, r) {
              1 & e &&
                ke("input", function (o) {
                  return r._handleInput(o.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (o) {
                  return r._compositionEnd(o.target.value);
                });
            },
            features: [oe([KL]), W],
          })),
          n
        );
      })();
      function gr(n) {
        return (
          null == n ||
          (("string" == typeof n || Array.isArray(n)) && 0 === n.length)
        );
      }
      function DD(n) {
        return null != n && "number" == typeof n.length;
      }
      const lt = new w("NgValidators"),
        yr = new w("NgAsyncValidators"),
        XL =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class rf {
        static min(t) {
          return (function ED(n) {
            return (t) => {
              if (gr(t.value) || gr(n)) return null;
              const e = parseFloat(t.value);
              return !isNaN(e) && e < n
                ? { min: { min: n, actual: t.value } }
                : null;
            };
          })(t);
        }
        static max(t) {
          return (function wD(n) {
            return (t) => {
              if (gr(t.value) || gr(n)) return null;
              const e = parseFloat(t.value);
              return !isNaN(e) && e > n
                ? { max: { max: n, actual: t.value } }
                : null;
            };
          })(t);
        }
        static required(t) {
          return (function MD(n) {
            return gr(n.value) ? { required: !0 } : null;
          })(t);
        }
        static requiredTrue(t) {
          return (function SD(n) {
            return !0 === n.value ? null : { required: !0 };
          })(t);
        }
        static email(t) {
          return (function AD(n) {
            return gr(n.value) || XL.test(n.value) ? null : { email: !0 };
          })(t);
        }
        static minLength(t) {
          return (function ID(n) {
            return (t) =>
              gr(t.value) || !DD(t.value)
                ? null
                : t.value.length < n
                ? {
                    minlength: {
                      requiredLength: n,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static maxLength(t) {
          return (function TD(n) {
            return (t) =>
              DD(t.value) && t.value.length > n
                ? {
                    maxlength: {
                      requiredLength: n,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static pattern(t) {
          return (function FD(n) {
            if (!n) return $l;
            let t, e;
            return (
              "string" == typeof n
                ? ((e = ""),
                  "^" !== n.charAt(0) && (e += "^"),
                  (e += n),
                  "$" !== n.charAt(n.length - 1) && (e += "$"),
                  (t = new RegExp(e)))
                : ((e = n.toString()), (t = n)),
              (r) => {
                if (gr(r.value)) return null;
                const i = r.value;
                return t.test(i)
                  ? null
                  : { pattern: { requiredPattern: e, actualValue: i } };
              }
            );
          })(t);
        }
        static nullValidator(t) {
          return null;
        }
        static compose(t) {
          return PD(t);
        }
        static composeAsync(t) {
          return LD(t);
        }
      }
      function $l(n) {
        return null;
      }
      function xD(n) {
        return null != n;
      }
      function RD(n) {
        return es(n) ? Ue(n) : n;
      }
      function ND(n) {
        let t = {};
        return (
          n.forEach((e) => {
            t = null != e ? { ...t, ...e } : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function kD(n, t) {
        return t.map((e) => e(n));
      }
      function OD(n) {
        return n.map((t) =>
          (function JL(n) {
            return !n.validate;
          })(t)
            ? t
            : (e) => t.validate(e)
        );
      }
      function PD(n) {
        if (!n) return null;
        const t = n.filter(xD);
        return 0 == t.length
          ? null
          : function (e) {
              return ND(kD(e, t));
            };
      }
      function sf(n) {
        return null != n ? PD(OD(n)) : null;
      }
      function LD(n) {
        if (!n) return null;
        const t = n.filter(xD);
        return 0 == t.length
          ? null
          : function (e) {
              return (function vD(...n) {
                if (1 === n.length) {
                  const t = n[0];
                  if (si(t)) return Ul(t, null);
                  if (zu(t) && Object.getPrototypeOf(t) === Object.prototype) {
                    const e = Object.keys(t);
                    return Ul(
                      e.map((r) => t[r]),
                      e
                    );
                  }
                }
                if ("function" == typeof n[n.length - 1]) {
                  const t = n.pop();
                  return Ul(
                    (n = 1 === n.length && si(n[0]) ? n[0] : n),
                    null
                  ).pipe(B((e) => t(...e)));
                }
                return Ul(n, null);
              })(kD(e, t).map(RD)).pipe(B(ND));
            };
      }
      function af(n) {
        return null != n ? LD(OD(n)) : null;
      }
      function VD(n, t) {
        return null === n ? [t] : Array.isArray(n) ? [...n, t] : [n, t];
      }
      function BD(n) {
        return n._rawValidators;
      }
      function HD(n) {
        return n._rawAsyncValidators;
      }
      function lf(n) {
        return n ? (Array.isArray(n) ? n : [n]) : [];
      }
      function zl(n, t) {
        return Array.isArray(n) ? n.includes(t) : n === t;
      }
      function UD(n, t) {
        const e = lf(t);
        return (
          lf(n).forEach((i) => {
            zl(e, i) || e.push(i);
          }),
          e
        );
      }
      function jD(n, t) {
        return lf(t).filter((e) => !zl(n, e));
      }
      class $D {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = sf(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = af(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t) {
          this.control && this.control.reset(t);
        }
        hasError(t, e) {
          return !!this.control && this.control.hasError(t, e);
        }
        getError(t, e) {
          return this.control ? this.control.getError(t, e) : null;
        }
      }
      class bt extends $D {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class Kn extends $D {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class zD {
        constructor(t) {
          this._cd = t;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let GD = (() => {
        class n extends zD {
          constructor(e) {
            super(e);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(g(Kn, 2));
          }),
          (n.ɵdir = M({
            type: n,
            selectors: [
              ["", "formControlName", ""],
              ["", "ngModel", ""],
              ["", "formControl", ""],
            ],
            hostVars: 14,
            hostBindings: function (e, r) {
              2 & e &&
                Le("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                  "ng-pristine",
                  r.isPristine
                )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                  "ng-invalid",
                  r.isInvalid
                )("ng-pending", r.isPending);
            },
            features: [W],
          })),
          n
        );
      })();
      const ws = "VALID",
        ql = "INVALID",
        Ji = "PENDING",
        Ms = "DISABLED";
      function hf(n) {
        return (Wl(n) ? n.validators : n) || null;
      }
      function ff(n, t) {
        return (Wl(t) ? t.asyncValidators : n) || null;
      }
      function Wl(n) {
        return null != n && !Array.isArray(n) && "object" == typeof n;
      }
      class QD {
        constructor(t, e) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(t),
            this._assignAsyncValidators(e);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === ws;
        }
        get invalid() {
          return this.status === ql;
        }
        get pending() {
          return this.status == Ji;
        }
        get disabled() {
          return this.status === Ms;
        }
        get enabled() {
          return this.status !== Ms;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(t) {
          this._assignValidators(t);
        }
        setAsyncValidators(t) {
          this._assignAsyncValidators(t);
        }
        addValidators(t) {
          this.setValidators(UD(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(UD(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(jD(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(jD(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return zl(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return zl(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((e) => {
              e.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((e) => {
              e.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = Ji),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const e = this._parentMarkedDirty(t.onlySelf);
          (this.status = Ms),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...t, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...t, skipPristineCheck: e }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(t = {}) {
          const e = this._parentMarkedDirty(t.onlySelf);
          (this.status = ws),
            this._forEachChild((r) => {
              r.enable({ ...t, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors({ ...t, skipPristineCheck: e }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === ws || this.status === Ji) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((e) => e._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? Ms : ws;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = Ji), (this._hasOwnPendingAsyncValidator = !0);
            const e = RD(this.asyncValidator(this));
            this._asyncValidationSubscription = e.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, e = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== e.emitEvent);
        }
        get(t) {
          let e = t;
          return null == e ||
            (Array.isArray(e) || (e = e.split(".")), 0 === e.length)
            ? null
            : e.reduce((r, i) => r && r._find(i), this);
        }
        getError(t, e) {
          const r = e ? this.get(e) : this;
          return r && r.errors ? r.errors[t] : null;
        }
        hasError(t, e) {
          return !!this.getError(t, e);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new pe()), (this.statusChanges = new pe());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? Ms
            : this.errors
            ? ql
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(Ji)
            ? Ji
            : this._anyControlsHaveStatus(ql)
            ? ql
            : ws;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((e) => e.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          Wl(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(t) {
          return null;
        }
        _assignValidators(t) {
          (this._rawValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedValidatorFn = (function aV(n) {
              return Array.isArray(n) ? sf(n) : n || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(t) {
          (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedAsyncValidatorFn = (function lV(n) {
              return Array.isArray(n) ? af(n) : n || null;
            })(this._rawAsyncValidators));
        }
      }
      class pf extends QD {
        constructor(t, e, r) {
          super(hf(e), ff(r, e)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(e),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(t, e) {
          return this.controls[t]
            ? this.controls[t]
            : ((this.controls[t] = e),
              e.setParent(this),
              e._registerOnCollectionChange(this._onCollectionChange),
              e);
        }
        addControl(t, e, r = {}) {
          this.registerControl(t, e),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(t, e = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            this.updateValueAndValidity({ emitEvent: e.emitEvent }),
            this._onCollectionChange();
        }
        setControl(t, e, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            e && this.registerControl(t, e),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(t) {
          return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
        }
        setValue(t, e = {}) {
          (function KD(n, t, e) {
            n._forEachChild((r, i) => {
              if (void 0 === e[i]) throw new b(1002, "");
            });
          })(this, 0, t),
            Object.keys(t).forEach((r) => {
              (function WD(n, t, e) {
                const r = n.controls;
                if (!(t ? Object.keys(r) : r).length) throw new b(1e3, "");
                if (!r[e]) throw new b(1001, "");
              })(this, !0, r),
                this.controls[r].setValue(t[r], {
                  onlySelf: !0,
                  emitEvent: e.emitEvent,
                });
            }),
            this.updateValueAndValidity(e);
        }
        patchValue(t, e = {}) {
          null != t &&
            (Object.keys(t).forEach((r) => {
              const i = this.controls[r];
              i && i.patchValue(t[r], { onlySelf: !0, emitEvent: e.emitEvent });
            }),
            this.updateValueAndValidity(e));
        }
        reset(t = {}, e = {}) {
          this._forEachChild((r, i) => {
            r.reset(t[i], { onlySelf: !0, emitEvent: e.emitEvent });
          }),
            this._updatePristine(e),
            this._updateTouched(e),
            this.updateValueAndValidity(e);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (t, e, r) => ((t[r] = e.getRawValue()), t)
          );
        }
        _syncPendingControls() {
          let t = this._reduceChildren(
            !1,
            (e, r) => !!r._syncPendingControls() || e
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          Object.keys(this.controls).forEach((e) => {
            const r = this.controls[e];
            r && t(r, e);
          });
        }
        _setUpControls() {
          this._forEachChild((t) => {
            t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(t) {
          for (const [e, r] of Object.entries(this.controls))
            if (this.contains(e) && t(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (e, r, i) => ((r.enabled || this.disabled) && (e[i] = r.value), e)
          );
        }
        _reduceChildren(t, e) {
          let r = t;
          return (
            this._forEachChild((i, o) => {
              r = e(r, i, o);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const t of Object.keys(this.controls))
            if (this.controls[t].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(t) {
          return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
        }
      }
      const eo = new w("CallSetDisabledState", {
          providedIn: "root",
          factory: () => Kl,
        }),
        Kl = "always";
      function Ss(n, t, e = Kl) {
        mf(n, t),
          t.valueAccessor.writeValue(n.value),
          (n.disabled || "always" === e) &&
            t.valueAccessor.setDisabledState?.(n.disabled),
          (function dV(n, t) {
            t.valueAccessor.registerOnChange((e) => {
              (n._pendingValue = e),
                (n._pendingChange = !0),
                (n._pendingDirty = !0),
                "change" === n.updateOn && YD(n, t);
            });
          })(n, t),
          (function fV(n, t) {
            const e = (r, i) => {
              t.valueAccessor.writeValue(r), i && t.viewToModelUpdate(r);
            };
            n.registerOnChange(e),
              t._registerOnDestroy(() => {
                n._unregisterOnChange(e);
              });
          })(n, t),
          (function hV(n, t) {
            t.valueAccessor.registerOnTouched(() => {
              (n._pendingTouched = !0),
                "blur" === n.updateOn && n._pendingChange && YD(n, t),
                "submit" !== n.updateOn && n.markAsTouched();
            });
          })(n, t),
          (function cV(n, t) {
            if (t.valueAccessor.setDisabledState) {
              const e = (r) => {
                t.valueAccessor.setDisabledState(r);
              };
              n.registerOnDisabledChange(e),
                t._registerOnDestroy(() => {
                  n._unregisterOnDisabledChange(e);
                });
            }
          })(n, t);
      }
      function Yl(n, t, e = !0) {
        const r = () => {};
        t.valueAccessor &&
          (t.valueAccessor.registerOnChange(r),
          t.valueAccessor.registerOnTouched(r)),
          Xl(n, t),
          n &&
            (t._invokeOnDestroyCallbacks(),
            n._registerOnCollectionChange(() => {}));
      }
      function Zl(n, t) {
        n.forEach((e) => {
          e.registerOnValidatorChange && e.registerOnValidatorChange(t);
        });
      }
      function mf(n, t) {
        const e = BD(n);
        null !== t.validator
          ? n.setValidators(VD(e, t.validator))
          : "function" == typeof e && n.setValidators([e]);
        const r = HD(n);
        null !== t.asyncValidator
          ? n.setAsyncValidators(VD(r, t.asyncValidator))
          : "function" == typeof r && n.setAsyncValidators([r]);
        const i = () => n.updateValueAndValidity();
        Zl(t._rawValidators, i), Zl(t._rawAsyncValidators, i);
      }
      function Xl(n, t) {
        let e = !1;
        if (null !== n) {
          if (null !== t.validator) {
            const i = BD(n);
            if (Array.isArray(i) && i.length > 0) {
              const o = i.filter((s) => s !== t.validator);
              o.length !== i.length && ((e = !0), n.setValidators(o));
            }
          }
          if (null !== t.asyncValidator) {
            const i = HD(n);
            if (Array.isArray(i) && i.length > 0) {
              const o = i.filter((s) => s !== t.asyncValidator);
              o.length !== i.length && ((e = !0), n.setAsyncValidators(o));
            }
          }
        }
        const r = () => {};
        return Zl(t._rawValidators, r), Zl(t._rawAsyncValidators, r), e;
      }
      function YD(n, t) {
        n._pendingDirty && n.markAsDirty(),
          n.setValue(n._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(n._pendingValue),
          (n._pendingChange = !1);
      }
      function ZD(n, t) {
        mf(n, t);
      }
      function XD(n, t) {
        n._syncPendingControls(),
          t.forEach((e) => {
            const r = e.control;
            "submit" === r.updateOn &&
              r._pendingChange &&
              (e.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
          });
      }
      const _V = { provide: bt, useExisting: Ce(() => Jl) },
        As = (() => Promise.resolve())();
      let Jl = (() => {
        class n extends bt {
          constructor(e, r, i) {
            super(),
              (this.callSetDisabledState = i),
              (this.submitted = !1),
              (this._directives = new Set()),
              (this.ngSubmit = new pe()),
              (this.form = new pf({}, sf(e), af(r)));
          }
          ngAfterViewInit() {
            this._setUpdateStrategy();
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          get controls() {
            return this.form.controls;
          }
          addControl(e) {
            As.then(() => {
              const r = this._findContainer(e.path);
              (e.control = r.registerControl(e.name, e.control)),
                Ss(e.control, e, this.callSetDisabledState),
                e.control.updateValueAndValidity({ emitEvent: !1 }),
                this._directives.add(e);
            });
          }
          getControl(e) {
            return this.form.get(e.path);
          }
          removeControl(e) {
            As.then(() => {
              const r = this._findContainer(e.path);
              r && r.removeControl(e.name), this._directives.delete(e);
            });
          }
          addFormGroup(e) {
            As.then(() => {
              const r = this._findContainer(e.path),
                i = new pf({});
              ZD(i, e),
                r.registerControl(e.name, i),
                i.updateValueAndValidity({ emitEvent: !1 });
            });
          }
          removeFormGroup(e) {
            As.then(() => {
              const r = this._findContainer(e.path);
              r && r.removeControl(e.name);
            });
          }
          getFormGroup(e) {
            return this.form.get(e.path);
          }
          updateModel(e, r) {
            As.then(() => {
              this.form.get(e.path).setValue(r);
            });
          }
          setValue(e) {
            this.control.setValue(e);
          }
          onSubmit(e) {
            return (
              (this.submitted = !0),
              XD(this.form, this._directives),
              this.ngSubmit.emit(e),
              "dialog" === e?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(e) {
            this.form.reset(e), (this.submitted = !1);
          }
          _setUpdateStrategy() {
            this.options &&
              null != this.options.updateOn &&
              (this.form._updateOn = this.options.updateOn);
          }
          _findContainer(e) {
            return e.pop(), e.length ? this.form.get(e) : this.form;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(g(lt, 10), g(yr, 10), g(eo, 8));
          }),
          (n.ɵdir = M({
            type: n,
            selectors: [
              ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
              ["ng-form"],
              ["", "ngForm", ""],
            ],
            hostBindings: function (e, r) {
              1 & e &&
                ke("submit", function (o) {
                  return r.onSubmit(o);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { options: ["ngFormOptions", "options"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [oe([_V]), W],
          })),
          n
        );
      })();
      function JD(n, t) {
        const e = n.indexOf(t);
        e > -1 && n.splice(e, 1);
      }
      function eE(n) {
        return (
          "object" == typeof n &&
          null !== n &&
          2 === Object.keys(n).length &&
          "value" in n &&
          "disabled" in n
        );
      }
      const eu = class extends QD {
        constructor(t = null, e, r) {
          super(hf(e), ff(r, e)),
            (this.defaultValue = null),
            (this._onChange = []),
            (this._pendingChange = !1),
            this._applyFormState(t),
            this._setUpdateStrategy(e),
            this._initObservables(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            }),
            Wl(e) &&
              (e.nonNullable || e.initialValueIsDefault) &&
              (this.defaultValue = eE(t) ? t.value : t);
        }
        setValue(t, e = {}) {
          (this.value = this._pendingValue = t),
            this._onChange.length &&
              !1 !== e.emitModelToViewChange &&
              this._onChange.forEach((r) =>
                r(this.value, !1 !== e.emitViewToModelChange)
              ),
            this.updateValueAndValidity(e);
        }
        patchValue(t, e = {}) {
          this.setValue(t, e);
        }
        reset(t = this.defaultValue, e = {}) {
          this._applyFormState(t),
            this.markAsPristine(e),
            this.markAsUntouched(e),
            this.setValue(this.value, e),
            (this._pendingChange = !1);
        }
        _updateValue() {}
        _anyControls(t) {
          return !1;
        }
        _allControlsDisabled() {
          return this.disabled;
        }
        registerOnChange(t) {
          this._onChange.push(t);
        }
        _unregisterOnChange(t) {
          JD(this._onChange, t);
        }
        registerOnDisabledChange(t) {
          this._onDisabledChange.push(t);
        }
        _unregisterOnDisabledChange(t) {
          JD(this._onDisabledChange, t);
        }
        _forEachChild(t) {}
        _syncPendingControls() {
          return !(
            "submit" !== this.updateOn ||
            (this._pendingDirty && this.markAsDirty(),
            this._pendingTouched && this.markAsTouched(),
            !this._pendingChange) ||
            (this.setValue(this._pendingValue, {
              onlySelf: !0,
              emitModelToViewChange: !1,
            }),
            0)
          );
        }
        _applyFormState(t) {
          eE(t)
            ? ((this.value = this._pendingValue = t.value),
              t.disabled
                ? this.disable({ onlySelf: !0, emitEvent: !1 })
                : this.enable({ onlySelf: !0, emitEvent: !1 }))
            : (this.value = this._pendingValue = t);
        }
      };
      let sE = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵmod = me({ type: n })),
          (n.ɵinj = de({})),
          n
        );
      })();
      const vf = new w("NgModelWithFormControlWarning"),
        AV = { provide: Kn, useExisting: Ce(() => bf) };
      let bf = (() => {
        class n extends Kn {
          constructor(e, r, i, o, s) {
            super(),
              (this._ngModelWarningConfig = o),
              (this.callSetDisabledState = s),
              (this.update = new pe()),
              (this._ngModelWarningSent = !1),
              this._setValidators(e),
              this._setAsyncValidators(r),
              (this.valueAccessor = (function _f(n, t) {
                if (!t) return null;
                let e, r, i;
                return (
                  Array.isArray(t),
                  t.forEach((o) => {
                    o.constructor === jl
                      ? (e = o)
                      : (function gV(n) {
                          return Object.getPrototypeOf(n.constructor) === Kr;
                        })(o)
                      ? (r = o)
                      : (i = o);
                  }),
                  i || r || e || null
                );
              })(0, i));
          }
          set isDisabled(e) {}
          ngOnChanges(e) {
            if (this._isControlChanged(e)) {
              const r = e.form.previousValue;
              r && Yl(r, this, !1),
                Ss(this.form, this, this.callSetDisabledState),
                this.form.updateValueAndValidity({ emitEvent: !1 });
            }
            (function yf(n, t) {
              if (!n.hasOwnProperty("model")) return !1;
              const e = n.model;
              return !!e.isFirstChange() || !Object.is(t, e.currentValue);
            })(e, this.viewModel) &&
              (this.form.setValue(this.model), (this.viewModel = this.model));
          }
          ngOnDestroy() {
            this.form && Yl(this.form, this, !1);
          }
          get path() {
            return [];
          }
          get control() {
            return this.form;
          }
          viewToModelUpdate(e) {
            (this.viewModel = e), this.update.emit(e);
          }
          _isControlChanged(e) {
            return e.hasOwnProperty("form");
          }
        }
        return (
          (n._ngModelWarningSentOnce = !1),
          (n.ɵfac = function (e) {
            return new (e || n)(
              g(lt, 10),
              g(yr, 10),
              g(Tn, 10),
              g(vf, 8),
              g(eo, 8)
            );
          }),
          (n.ɵdir = M({
            type: n,
            selectors: [["", "formControl", ""]],
            inputs: {
              form: ["formControl", "form"],
              isDisabled: ["disabled", "isDisabled"],
              model: ["ngModel", "model"],
            },
            outputs: { update: "ngModelChange" },
            exportAs: ["ngForm"],
            features: [oe([AV]), W, Dt],
          })),
          n
        );
      })();
      const IV = { provide: bt, useExisting: Ce(() => tu) };
      let tu = (() => {
          class n extends bt {
            constructor(e, r, i) {
              super(),
                (this.callSetDisabledState = i),
                (this.submitted = !1),
                (this._onCollectionChange = () => this._updateDomValue()),
                (this.directives = []),
                (this.form = null),
                (this.ngSubmit = new pe()),
                this._setValidators(e),
                this._setAsyncValidators(r);
            }
            ngOnChanges(e) {
              this._checkFormPresent(),
                e.hasOwnProperty("form") &&
                  (this._updateValidators(),
                  this._updateDomValue(),
                  this._updateRegistrations(),
                  (this._oldForm = this.form));
            }
            ngOnDestroy() {
              this.form &&
                (Xl(this.form, this),
                this.form._onCollectionChange === this._onCollectionChange &&
                  this.form._registerOnCollectionChange(() => {}));
            }
            get formDirective() {
              return this;
            }
            get control() {
              return this.form;
            }
            get path() {
              return [];
            }
            addControl(e) {
              const r = this.form.get(e.path);
              return (
                Ss(r, e, this.callSetDisabledState),
                r.updateValueAndValidity({ emitEvent: !1 }),
                this.directives.push(e),
                r
              );
            }
            getControl(e) {
              return this.form.get(e.path);
            }
            removeControl(e) {
              Yl(e.control || null, e, !1),
                (function yV(n, t) {
                  const e = n.indexOf(t);
                  e > -1 && n.splice(e, 1);
                })(this.directives, e);
            }
            addFormGroup(e) {
              this._setUpFormContainer(e);
            }
            removeFormGroup(e) {
              this._cleanUpFormContainer(e);
            }
            getFormGroup(e) {
              return this.form.get(e.path);
            }
            addFormArray(e) {
              this._setUpFormContainer(e);
            }
            removeFormArray(e) {
              this._cleanUpFormContainer(e);
            }
            getFormArray(e) {
              return this.form.get(e.path);
            }
            updateModel(e, r) {
              this.form.get(e.path).setValue(r);
            }
            onSubmit(e) {
              return (
                (this.submitted = !0),
                XD(this.form, this.directives),
                this.ngSubmit.emit(e),
                "dialog" === e?.target?.method
              );
            }
            onReset() {
              this.resetForm();
            }
            resetForm(e) {
              this.form.reset(e), (this.submitted = !1);
            }
            _updateDomValue() {
              this.directives.forEach((e) => {
                const r = e.control,
                  i = this.form.get(e.path);
                r !== i &&
                  (Yl(r || null, e),
                  ((n) => n instanceof eu)(i) &&
                    (Ss(i, e, this.callSetDisabledState), (e.control = i)));
              }),
                this.form._updateTreeValidity({ emitEvent: !1 });
            }
            _setUpFormContainer(e) {
              const r = this.form.get(e.path);
              ZD(r, e), r.updateValueAndValidity({ emitEvent: !1 });
            }
            _cleanUpFormContainer(e) {
              if (this.form) {
                const r = this.form.get(e.path);
                r &&
                  (function pV(n, t) {
                    return Xl(n, t);
                  })(r, e) &&
                  r.updateValueAndValidity({ emitEvent: !1 });
              }
            }
            _updateRegistrations() {
              this.form._registerOnCollectionChange(this._onCollectionChange),
                this._oldForm &&
                  this._oldForm._registerOnCollectionChange(() => {});
            }
            _updateValidators() {
              mf(this.form, this), this._oldForm && Xl(this._oldForm, this);
            }
            _checkFormPresent() {}
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(g(lt, 10), g(yr, 10), g(eo, 8));
            }),
            (n.ɵdir = M({
              type: n,
              selectors: [["", "formGroup", ""]],
              hostBindings: function (e, r) {
                1 & e &&
                  ke("submit", function (o) {
                    return r.onSubmit(o);
                  })("reset", function () {
                    return r.onReset();
                  });
              },
              inputs: { form: ["formGroup", "form"] },
              outputs: { ngSubmit: "ngSubmit" },
              exportAs: ["ngForm"],
              features: [oe([IV]), W, Dt],
            })),
            n
          );
        })(),
        DE = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ imports: [sE] })),
            n
          );
        })(),
        qV = (() => {
          class n {
            static withConfig(e) {
              return {
                ngModule: n,
                providers: [
                  { provide: eo, useValue: e.callSetDisabledState ?? Kl },
                ],
              };
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ imports: [DE] })),
            n
          );
        })(),
        WV = (() => {
          class n {
            static withConfig(e) {
              return {
                ngModule: n,
                providers: [
                  {
                    provide: vf,
                    useValue: e.warnOnNgModelWithFormControl ?? "always",
                  },
                  { provide: eo, useValue: e.callSetDisabledState ?? Kl },
                ],
              };
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ imports: [DE] })),
            n
          );
        })();
      const QV = new w("MAT_INPUT_VALUE_ACCESSOR"),
        YV = [
          "button",
          "checkbox",
          "file",
          "hidden",
          "image",
          "radio",
          "range",
          "reset",
          "submit",
        ];
      let ZV = 0;
      const XV = EP(
        class {
          constructor(n, t, e, r) {
            (this._defaultErrorStateMatcher = n),
              (this._parentForm = t),
              (this._parentFormGroup = e),
              (this.ngControl = r);
          }
        }
      );
      let JV = (() => {
          class n extends XV {
            constructor(e, r, i, o, s, a, l, u, c, d) {
              super(a, o, s, i),
                (this._elementRef = e),
                (this._platform = r),
                (this._autofillMonitor = u),
                (this._formField = d),
                (this._uid = "mat-input-" + ZV++),
                (this.focused = !1),
                (this.stateChanges = new He()),
                (this.controlType = "mat-input"),
                (this.autofilled = !1),
                (this._disabled = !1),
                (this._required = !1),
                (this._type = "text"),
                (this._readonly = !1),
                (this._neverEmptyInputTypes = [
                  "date",
                  "datetime",
                  "datetime-local",
                  "month",
                  "time",
                  "week",
                ].filter((p) => DC().has(p)));
              const h = this._elementRef.nativeElement,
                f = h.nodeName.toLowerCase();
              (this._inputValueAccessor = l || h),
                (this._previousNativeValue = this.value),
                (this.id = this.id),
                r.IOS &&
                  c.runOutsideAngular(() => {
                    e.nativeElement.addEventListener("keyup", (p) => {
                      const m = p.target;
                      !m.value &&
                        0 === m.selectionStart &&
                        0 === m.selectionEnd &&
                        (m.setSelectionRange(1, 1), m.setSelectionRange(0, 0));
                    });
                  }),
                (this._isServer = !this._platform.isBrowser),
                (this._isNativeSelect = "select" === f),
                (this._isTextarea = "textarea" === f),
                (this._isInFormField = !!d),
                this._isNativeSelect &&
                  (this.controlType = h.multiple
                    ? "mat-native-select-multiple"
                    : "mat-native-select");
            }
            get disabled() {
              return this.ngControl && null !== this.ngControl.disabled
                ? this.ngControl.disabled
                : this._disabled;
            }
            set disabled(e) {
              (this._disabled = Qt(e)),
                this.focused && ((this.focused = !1), this.stateChanges.next());
            }
            get id() {
              return this._id;
            }
            set id(e) {
              this._id = e || this._uid;
            }
            get required() {
              return this._required;
            }
            set required(e) {
              this._required = Qt(e);
            }
            get type() {
              return this._type;
            }
            set type(e) {
              (this._type = e || "text"),
                this._validateType(),
                !this._isTextarea &&
                  DC().has(this._type) &&
                  (this._elementRef.nativeElement.type = this._type);
            }
            get value() {
              return this._inputValueAccessor.value;
            }
            set value(e) {
              e !== this.value &&
                ((this._inputValueAccessor.value = e),
                this.stateChanges.next());
            }
            get readonly() {
              return this._readonly;
            }
            set readonly(e) {
              this._readonly = Qt(e);
            }
            ngAfterViewInit() {
              this._platform.isBrowser &&
                this._autofillMonitor
                  .monitor(this._elementRef.nativeElement)
                  .subscribe((e) => {
                    (this.autofilled = e.isAutofilled),
                      this.stateChanges.next();
                  });
            }
            ngOnChanges() {
              this.stateChanges.next();
            }
            ngOnDestroy() {
              this.stateChanges.complete(),
                this._platform.isBrowser &&
                  this._autofillMonitor.stopMonitoring(
                    this._elementRef.nativeElement
                  );
            }
            ngDoCheck() {
              this.ngControl && this.updateErrorState(),
                this._dirtyCheckNativeValue(),
                this._dirtyCheckPlaceholder();
            }
            focus(e) {
              this._elementRef.nativeElement.focus(e);
            }
            _focusChanged(e) {
              e !== this.focused &&
                ((this.focused = e), this.stateChanges.next());
            }
            _onInput() {}
            _dirtyCheckPlaceholder() {
              var e, r;
              const i =
                null !==
                  (r =
                    null === (e = this._formField) || void 0 === e
                      ? void 0
                      : e._hideControlPlaceholder) &&
                void 0 !== r &&
                r.call(e)
                  ? null
                  : this.placeholder;
              if (i !== this._previousPlaceholder) {
                const o = this._elementRef.nativeElement;
                (this._previousPlaceholder = i),
                  i
                    ? o.setAttribute("placeholder", i)
                    : o.removeAttribute("placeholder");
              }
            }
            _dirtyCheckNativeValue() {
              const e = this._elementRef.nativeElement.value;
              this._previousNativeValue !== e &&
                ((this._previousNativeValue = e), this.stateChanges.next());
            }
            _validateType() {
              YV.indexOf(this._type);
            }
            _isNeverEmpty() {
              return this._neverEmptyInputTypes.indexOf(this._type) > -1;
            }
            _isBadInput() {
              let e = this._elementRef.nativeElement.validity;
              return e && e.badInput;
            }
            get empty() {
              return !(
                this._isNeverEmpty() ||
                this._elementRef.nativeElement.value ||
                this._isBadInput() ||
                this.autofilled
              );
            }
            get shouldLabelFloat() {
              if (this._isNativeSelect) {
                const e = this._elementRef.nativeElement,
                  r = e.options[0];
                return (
                  this.focused ||
                  e.multiple ||
                  !this.empty ||
                  !!(e.selectedIndex > -1 && r && r.label)
                );
              }
              return this.focused || !this.empty;
            }
            setDescribedByIds(e) {
              e.length
                ? this._elementRef.nativeElement.setAttribute(
                    "aria-describedby",
                    e.join(" ")
                  )
                : this._elementRef.nativeElement.removeAttribute(
                    "aria-describedby"
                  );
            }
            onContainerClick() {
              this.focused || this.focus();
            }
            _isInlineSelect() {
              const e = this._elementRef.nativeElement;
              return this._isNativeSelect && (e.multiple || e.size > 1);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(
                g(fe),
                g(_t),
                g(Kn, 10),
                g(Jl, 8),
                g(tu, 8),
                g(QC),
                g(QV, 10),
                g(sD),
                g(K),
                g(_D, 8)
              );
            }),
            (n.ɵdir = M({
              type: n,
              selectors: [
                ["input", "matInput", ""],
                ["textarea", "matInput", ""],
                ["select", "matNativeControl", ""],
                ["input", "matNativeControl", ""],
                ["textarea", "matNativeControl", ""],
              ],
              hostAttrs: [
                1,
                "mat-input-element",
                "mat-form-field-autofill-control",
              ],
              hostVars: 11,
              hostBindings: function (e, r) {
                1 & e &&
                  ke("focus", function () {
                    return r._focusChanged(!0);
                  })("blur", function () {
                    return r._focusChanged(!1);
                  })("input", function () {
                    return r._onInput();
                  }),
                  2 & e &&
                    (Ja("disabled", r.disabled)("required", r.required),
                    Pe("id", r.id)("data-placeholder", r.placeholder)(
                      "readonly",
                      (r.readonly && !r._isNativeSelect) || null
                    )(
                      "aria-invalid",
                      r.empty && r.required ? null : r.errorState
                    )("aria-required", r.required),
                    Le("mat-input-server", r._isServer)(
                      "mat-native-select-inline",
                      r._isInlineSelect()
                    ));
              },
              inputs: {
                id: "id",
                disabled: "disabled",
                required: "required",
                type: "type",
                value: "value",
                readonly: "readonly",
                placeholder: "placeholder",
                errorStateMatcher: "errorStateMatcher",
                userAriaDescribedBy: [
                  "aria-describedby",
                  "userAriaDescribedBy",
                ],
              },
              exportAs: ["matInput"],
              features: [oe([{ provide: ef, useExisting: n }]), W, Dt],
            })),
            n
          );
        })(),
        eB = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ providers: [QC], imports: [aD, nf, vt, aD, nf] })),
            n
          );
        })();
      function to(n, t) {
        return new we(
          t
            ? (e) => t.schedule(tB, 0, { error: n, subscriber: e })
            : (e) => e.error(n)
        );
      }
      function tB({ error: n, subscriber: t }) {
        t.error(n);
      }
      function _r() {}
      function We(n, t, e) {
        return function (i) {
          return i.lift(new nB(n, t, e));
        };
      }
      class nB {
        constructor(t, e, r) {
          (this.nextOrObserver = t), (this.error = e), (this.complete = r);
        }
        call(t, e) {
          return e.subscribe(
            new rB(t, this.nextOrObserver, this.error, this.complete)
          );
        }
      }
      class rB extends ye {
        constructor(t, e, r, i) {
          super(t),
            (this._tapNext = _r),
            (this._tapError = _r),
            (this._tapComplete = _r),
            (this._tapError = r || _r),
            (this._tapComplete = i || _r),
            nr(e)
              ? ((this._context = this), (this._tapNext = e))
              : e &&
                ((this._context = e),
                (this._tapNext = e.next || _r),
                (this._tapError = e.error || _r),
                (this._tapComplete = e.complete || _r));
        }
        _next(t) {
          try {
            this._tapNext.call(this._context, t);
          } catch (e) {
            return void this.destination.error(e);
          }
          this.destination.next(t);
        }
        _error(t) {
          try {
            this._tapError.call(this._context, t);
          } catch (e) {
            return void this.destination.error(e);
          }
          this.destination.error(t);
        }
        _complete() {
          try {
            this._tapComplete.call(this._context);
          } catch (t) {
            return void this.destination.error(t);
          }
          return this.destination.complete();
        }
      }
      function vr(n) {
        return function (e) {
          const r = new iB(n),
            i = e.lift(r);
          return (r.caught = i);
        };
      }
      class iB {
        constructor(t) {
          this.selector = t;
        }
        call(t, e) {
          return e.subscribe(new oB(t, this.selector, this.caught));
        }
      }
      class oB extends Do {
        constructor(t, e, r) {
          super(t), (this.selector = e), (this.caught = r);
        }
        error(t) {
          if (!this.isStopped) {
            let e;
            try {
              e = this.selector(t, this.caught);
            } catch (o) {
              return void super.error(o);
            }
            this._unsubscribeAndRecycle();
            const r = new Co(this);
            this.add(r);
            const i = Eo(e, r);
            i !== r && this.add(i);
          }
        }
      }
      function nu(n) {
        return (t) => t.lift(new sB(n));
      }
      class sB {
        constructor(t) {
          this.callback = t;
        }
        call(t, e) {
          return e.subscribe(new aB(t, this.callback));
        }
      }
      class aB extends ye {
        constructor(t, e) {
          super(t), this.add(new Se(e));
        }
      }
      function br(n, t) {
        return et(n, t, 1);
      }
      function Qn(n, t) {
        return function (r) {
          return r.lift(new lB(n, t));
        };
      }
      class lB {
        constructor(t, e) {
          (this.predicate = t), (this.thisArg = e);
        }
        call(t, e) {
          return e.subscribe(new uB(t, this.predicate, this.thisArg));
        }
      }
      class uB extends ye {
        constructor(t, e, r) {
          super(t), (this.predicate = e), (this.thisArg = r), (this.count = 0);
        }
        _next(t) {
          let e;
          try {
            e = this.predicate.call(this.thisArg, t, this.count++);
          } catch (r) {
            return void this.destination.error(r);
          }
          e && this.destination.next(t);
        }
      }
      let HB = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵmod = me({ type: n })),
          (n.ɵinj = de({ imports: [vt, vt] })),
          n
        );
      })();
      const HE = ["mat-button", ""],
        UE = ["*"],
        jB = [
          "mat-button",
          "mat-flat-button",
          "mat-icon-button",
          "mat-raised-button",
          "mat-stroked-button",
          "mat-mini-fab",
          "mat-fab",
        ],
        $B = Qh(
          WC(
            DP(
              class {
                constructor(n) {
                  this._elementRef = n;
                }
              }
            )
          )
        );
      let $E = (() => {
          class n extends $B {
            constructor(e, r, i) {
              super(e),
                (this._focusMonitor = r),
                (this._animationMode = i),
                (this.isRoundButton = this._hasHostAttributes(
                  "mat-fab",
                  "mat-mini-fab"
                )),
                (this.isIconButton =
                  this._hasHostAttributes("mat-icon-button"));
              for (const o of jB)
                this._hasHostAttributes(o) &&
                  this._getHostElement().classList.add(o);
              e.nativeElement.classList.add("mat-button-base"),
                this.isRoundButton && (this.color = "accent");
            }
            ngAfterViewInit() {
              this._focusMonitor.monitor(this._elementRef, !0);
            }
            ngOnDestroy() {
              this._focusMonitor.stopMonitoring(this._elementRef);
            }
            focus(e, r) {
              e
                ? this._focusMonitor.focusVia(this._getHostElement(), e, r)
                : this._getHostElement().focus(r);
            }
            _getHostElement() {
              return this._elementRef.nativeElement;
            }
            _isRippleDisabled() {
              return this.disableRipple || this.disabled;
            }
            _hasHostAttributes(...e) {
              return e.some((r) => this._getHostElement().hasAttribute(r));
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(g(fe), g(Wh), g(cr, 8));
            }),
            (n.ɵcmp = Qe({
              type: n,
              selectors: [
                ["button", "mat-button", ""],
                ["button", "mat-raised-button", ""],
                ["button", "mat-icon-button", ""],
                ["button", "mat-fab", ""],
                ["button", "mat-mini-fab", ""],
                ["button", "mat-stroked-button", ""],
                ["button", "mat-flat-button", ""],
              ],
              viewQuery: function (e, r) {
                if ((1 & e && Wi(Vl, 5), 2 & e)) {
                  let i;
                  st((i = at())) && (r.ripple = i.first);
                }
              },
              hostAttrs: [1, "mat-focus-indicator"],
              hostVars: 5,
              hostBindings: function (e, r) {
                2 & e &&
                  (Pe("disabled", r.disabled || null),
                  Le(
                    "_mat-animation-noopable",
                    "NoopAnimations" === r._animationMode
                  )("mat-button-disabled", r.disabled));
              },
              inputs: {
                disabled: "disabled",
                disableRipple: "disableRipple",
                color: "color",
              },
              exportAs: ["matButton"],
              features: [W],
              attrs: HE,
              ngContentSelectors: UE,
              decls: 4,
              vars: 5,
              consts: [
                [1, "mat-button-wrapper"],
                [
                  "matRipple",
                  "",
                  1,
                  "mat-button-ripple",
                  3,
                  "matRippleDisabled",
                  "matRippleCentered",
                  "matRippleTrigger",
                ],
                [1, "mat-button-focus-overlay"],
              ],
              template: function (e, r) {
                1 & e &&
                  (wn(),
                  re(0, "span", 0),
                  Ie(1),
                  ie(),
                  kt(2, "span", 1)(3, "span", 2)),
                  2 & e &&
                    (_e(2),
                    Le(
                      "mat-button-ripple-round",
                      r.isRoundButton || r.isIconButton
                    ),
                    ge("matRippleDisabled", r._isRippleDisabled())(
                      "matRippleCentered",
                      r.isIconButton
                    )("matRippleTrigger", r._getHostElement()));
              },
              dependencies: [Vl],
              styles: [
                ".mat-button .mat-button-focus-overlay,.mat-icon-button .mat-button-focus-overlay{opacity:0}.mat-button:hover:not(.mat-button-disabled) .mat-button-focus-overlay,.mat-stroked-button:hover:not(.mat-button-disabled) .mat-button-focus-overlay{opacity:.04}@media(hover: none){.mat-button:hover:not(.mat-button-disabled) .mat-button-focus-overlay,.mat-stroked-button:hover:not(.mat-button-disabled) .mat-button-focus-overlay{opacity:0}}.mat-button,.mat-icon-button,.mat-stroked-button,.mat-flat-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible}.mat-button::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-stroked-button::-moz-focus-inner,.mat-flat-button::-moz-focus-inner{border:0}.mat-button.mat-button-disabled,.mat-icon-button.mat-button-disabled,.mat-stroked-button.mat-button-disabled,.mat-flat-button.mat-button-disabled{cursor:default}.mat-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-button.cdk-program-focused .mat-button-focus-overlay,.mat-icon-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-icon-button.cdk-program-focused .mat-button-focus-overlay,.mat-stroked-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-stroked-button.cdk-program-focused .mat-button-focus-overlay,.mat-flat-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-flat-button.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-button::-moz-focus-inner,.mat-icon-button::-moz-focus-inner,.mat-stroked-button::-moz-focus-inner,.mat-flat-button::-moz-focus-inner{border:0}.mat-raised-button{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-raised-button::-moz-focus-inner{border:0}.mat-raised-button.mat-button-disabled{cursor:default}.mat-raised-button.cdk-keyboard-focused .mat-button-focus-overlay,.mat-raised-button.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-raised-button::-moz-focus-inner{border:0}._mat-animation-noopable.mat-raised-button{transition:none;animation:none}.mat-stroked-button{border:1px solid currentColor;padding:0 15px;line-height:34px}.mat-stroked-button .mat-button-ripple.mat-ripple,.mat-stroked-button .mat-button-focus-overlay{top:-1px;left:-1px;right:-1px;bottom:-1px}.mat-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:56px;height:56px;padding:0;flex-shrink:0}.mat-fab::-moz-focus-inner{border:0}.mat-fab.mat-button-disabled{cursor:default}.mat-fab.cdk-keyboard-focused .mat-button-focus-overlay,.mat-fab.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-fab::-moz-focus-inner{border:0}._mat-animation-noopable.mat-fab{transition:none;animation:none}.mat-fab .mat-button-wrapper{padding:16px 0;display:inline-block;line-height:24px}.mat-mini-fab{box-sizing:border-box;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;outline:none;border:none;-webkit-tap-highlight-color:transparent;display:inline-block;white-space:nowrap;text-decoration:none;vertical-align:baseline;text-align:center;margin:0;min-width:64px;line-height:36px;padding:0 16px;border-radius:4px;overflow:visible;transform:translate3d(0, 0, 0);transition:background 400ms cubic-bezier(0.25, 0.8, 0.25, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);min-width:0;border-radius:50%;width:40px;height:40px;padding:0;flex-shrink:0}.mat-mini-fab::-moz-focus-inner{border:0}.mat-mini-fab.mat-button-disabled{cursor:default}.mat-mini-fab.cdk-keyboard-focused .mat-button-focus-overlay,.mat-mini-fab.cdk-program-focused .mat-button-focus-overlay{opacity:.12}.mat-mini-fab::-moz-focus-inner{border:0}._mat-animation-noopable.mat-mini-fab{transition:none;animation:none}.mat-mini-fab .mat-button-wrapper{padding:8px 0;display:inline-block;line-height:24px}.mat-icon-button{padding:0;min-width:0;width:40px;height:40px;flex-shrink:0;line-height:40px;border-radius:50%}.mat-icon-button i,.mat-icon-button .mat-icon{line-height:24px}.mat-button-ripple.mat-ripple,.mat-button-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-button-ripple.mat-ripple:not(:empty){transform:translateZ(0)}.mat-button-focus-overlay{opacity:0;transition:opacity 200ms cubic-bezier(0.35, 0, 0.25, 1),background-color 200ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable .mat-button-focus-overlay{transition:none}.mat-button-ripple-round{border-radius:50%;z-index:1}.mat-button .mat-button-wrapper>*,.mat-flat-button .mat-button-wrapper>*,.mat-stroked-button .mat-button-wrapper>*,.mat-raised-button .mat-button-wrapper>*,.mat-icon-button .mat-button-wrapper>*,.mat-fab .mat-button-wrapper>*,.mat-mini-fab .mat-button-wrapper>*{vertical-align:middle}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button{display:inline-flex;justify-content:center;align-items:center;font-size:inherit;width:2.5em;height:2.5em}.cdk-high-contrast-active .mat-button,.cdk-high-contrast-active .mat-flat-button,.cdk-high-contrast-active .mat-raised-button,.cdk-high-contrast-active .mat-icon-button,.cdk-high-contrast-active .mat-fab,.cdk-high-contrast-active .mat-mini-fab{outline:solid 1px}.cdk-high-contrast-active .mat-button-base.cdk-keyboard-focused,.cdk-high-contrast-active .mat-button-base.cdk-program-focused{outline:solid 3px}\n",
              ],
              encapsulation: 2,
              changeDetection: 0,
            })),
            n
          );
        })(),
        zB = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵmod = me({ type: n })),
            (n.ɵinj = de({ imports: [JC, vt, vt] })),
            n
          );
        })();
      const lu = (() => {
        function n() {
          return (
            Error.call(this),
            (this.message = "no elements in sequence"),
            (this.name = "EmptyError"),
            this
          );
        }
        return (n.prototype = Object.create(Error.prototype)), n;
      })();
      class GB extends ye {
        notifyNext(t, e, r, i, o) {
          this.destination.next(e);
        }
        notifyError(t, e) {
          this.destination.error(t);
        }
        notifyComplete(t) {
          this.destination.complete();
        }
      }
      class qB extends ye {
        constructor(t, e, r) {
          super(),
            (this.parent = t),
            (this.outerValue = e),
            (this.outerIndex = r),
            (this.index = 0);
        }
        _next(t) {
          this.parent.notifyNext(
            this.outerValue,
            t,
            this.outerIndex,
            this.index++,
            this
          );
        }
        _error(t) {
          this.parent.notifyError(t, this), this.unsubscribe();
        }
        _complete() {
          this.parent.notifyComplete(this), this.unsubscribe();
        }
      }
      function WB(n, t, e, r, i = new qB(n, e, r)) {
        if (!i.closed) return t instanceof we ? t.subscribe(i) : Gu(t)(i);
      }
      const zE = {};
      function GE(...n) {
        let t, e;
        return (
          li(n[n.length - 1]) && (e = n.pop()),
          "function" == typeof n[n.length - 1] && (t = n.pop()),
          1 === n.length && si(n[0]) && (n = n[0]),
          Wu(n, e).lift(new KB(t))
        );
      }
      class KB {
        constructor(t) {
          this.resultSelector = t;
        }
        call(t, e) {
          return e.subscribe(new QB(t, this.resultSelector));
        }
      }
      class QB extends GB {
        constructor(t, e) {
          super(t),
            (this.resultSelector = e),
            (this.active = 0),
            (this.values = []),
            (this.observables = []);
        }
        _next(t) {
          this.values.push(zE), this.observables.push(t);
        }
        _complete() {
          const t = this.observables,
            e = t.length;
          if (0 === e) this.destination.complete();
          else {
            (this.active = e), (this.toRespond = e);
            for (let r = 0; r < e; r++) this.add(WB(this, t[r], void 0, r));
          }
        }
        notifyComplete(t) {
          0 == (this.active -= 1) && this.destination.complete();
        }
        notifyNext(t, e, r) {
          const i = this.values,
            s = this.toRespond
              ? i[r] === zE
                ? --this.toRespond
                : this.toRespond
              : 0;
          (i[r] = e),
            0 === s &&
              (this.resultSelector
                ? this._tryResultSelector(i)
                : this.destination.next(i.slice()));
        }
        _tryResultSelector(t) {
          let e;
          try {
            e = this.resultSelector.apply(this, t);
          } catch (r) {
            return void this.destination.error(r);
          }
          this.destination.next(e);
        }
      }
      function qE(n) {
        return new we((t) => {
          let e;
          try {
            e = n();
          } catch (i) {
            return void t.error(i);
          }
          return (e ? Ue(e) : Uh()).subscribe(t);
        });
      }
      function gn(n, t) {
        return "function" == typeof t
          ? (e) =>
              e.pipe(gn((r, i) => Ue(n(r, i)).pipe(B((o, s) => t(r, o, i, s)))))
          : (e) => e.lift(new YB(n));
      }
      class YB {
        constructor(t) {
          this.project = t;
        }
        call(t, e) {
          return e.subscribe(new ZB(t, this.project));
        }
      }
      class ZB extends Do {
        constructor(t, e) {
          super(t), (this.project = e), (this.index = 0);
        }
        _next(t) {
          let e;
          const r = this.index++;
          try {
            e = this.project(t, r);
          } catch (i) {
            return void this.destination.error(i);
          }
          this._innerSub(e);
        }
        _innerSub(t) {
          const e = this.innerSubscription;
          e && e.unsubscribe();
          const r = new Co(this),
            i = this.destination;
          i.add(r),
            (this.innerSubscription = Eo(t, r)),
            this.innerSubscription !== r && i.add(this.innerSubscription);
        }
        _complete() {
          const { innerSubscription: t } = this;
          (!t || t.closed) && super._complete(), this.unsubscribe();
        }
        _unsubscribe() {
          this.innerSubscription = void 0;
        }
        notifyComplete() {
          (this.innerSubscription = void 0),
            this.isStopped && super._complete();
        }
        notifyNext(t) {
          this.destination.next(t);
        }
      }
      function uu(n = null) {
        return (t) => t.lift(new XB(n));
      }
      class XB {
        constructor(t) {
          this.defaultValue = t;
        }
        call(t, e) {
          return e.subscribe(new JB(t, this.defaultValue));
        }
      }
      class JB extends ye {
        constructor(t, e) {
          super(t), (this.defaultValue = e), (this.isEmpty = !0);
        }
        _next(t) {
          (this.isEmpty = !1), this.destination.next(t);
        }
        _complete() {
          this.isEmpty && this.destination.next(this.defaultValue),
            this.destination.complete();
        }
      }
      function WE(n = nH) {
        return (t) => t.lift(new eH(n));
      }
      class eH {
        constructor(t) {
          this.errorFactory = t;
        }
        call(t, e) {
          return e.subscribe(new tH(t, this.errorFactory));
        }
      }
      class tH extends ye {
        constructor(t, e) {
          super(t), (this.errorFactory = e), (this.hasValue = !1);
        }
        _next(t) {
          (this.hasValue = !0), this.destination.next(t);
        }
        _complete() {
          if (this.hasValue) return this.destination.complete();
          {
            let t;
            try {
              t = this.errorFactory();
            } catch (e) {
              t = e;
            }
            this.destination.error(t);
          }
        }
      }
      function nH() {
        return new lu();
      }
      function Er(n, t) {
        const e = arguments.length >= 2;
        return (r) =>
          r.pipe(
            n ? Qn((i, o) => n(i, o, r)) : na,
            fr(1),
            e ? uu(t) : WE(() => new lu())
          );
      }
      function KE(n, t) {
        let e = !1;
        return (
          arguments.length >= 2 && (e = !0),
          function (i) {
            return i.lift(new rH(n, t, e));
          }
        );
      }
      class rH {
        constructor(t, e, r = !1) {
          (this.accumulator = t), (this.seed = e), (this.hasSeed = r);
        }
        call(t, e) {
          return e.subscribe(
            new iH(t, this.accumulator, this.seed, this.hasSeed)
          );
        }
      }
      class iH extends ye {
        constructor(t, e, r, i) {
          super(t),
            (this.accumulator = e),
            (this._seed = r),
            (this.hasSeed = i),
            (this.index = 0);
        }
        get seed() {
          return this._seed;
        }
        set seed(t) {
          (this.hasSeed = !0), (this._seed = t);
        }
        _next(t) {
          if (this.hasSeed) return this._tryNext(t);
          (this.seed = t), this.destination.next(t);
        }
        _tryNext(t) {
          const e = this.index++;
          let r;
          try {
            r = this.accumulator(this.seed, t, e);
          } catch (i) {
            this.destination.error(i);
          }
          (this.seed = r), this.destination.next(r);
        }
      }
      function Ff(n) {
        return function (e) {
          return 0 === n ? Uh() : e.lift(new oH(n));
        };
      }
      class oH {
        constructor(t) {
          if (((this.total = t), this.total < 0)) throw new bC();
        }
        call(t, e) {
          return e.subscribe(new sH(t, this.total));
        }
      }
      class sH extends ye {
        constructor(t, e) {
          super(t),
            (this.total = e),
            (this.ring = new Array()),
            (this.count = 0);
        }
        _next(t) {
          const e = this.ring,
            r = this.total,
            i = this.count++;
          e.length < r ? e.push(t) : (e[i % r] = t);
        }
        _complete() {
          const t = this.destination;
          let e = this.count;
          if (e > 0) {
            const r = this.count >= this.total ? this.total : this.count,
              i = this.ring;
            for (let o = 0; o < r; o++) {
              const s = e++ % r;
              t.next(i[s]);
            }
          }
          t.complete();
        }
      }
      function QE(n, t) {
        const e = arguments.length >= 2;
        return (r) =>
          r.pipe(
            n ? Qn((i, o) => n(i, o, r)) : na,
            Ff(1),
            e ? uu(t) : WE(() => new lu())
          );
      }
      class lH {
        constructor(t, e) {
          (this.predicate = t), (this.inclusive = e);
        }
        call(t, e) {
          return e.subscribe(new uH(t, this.predicate, this.inclusive));
        }
      }
      class uH extends ye {
        constructor(t, e, r) {
          super(t),
            (this.predicate = e),
            (this.inclusive = r),
            (this.index = 0);
        }
        _next(t) {
          const e = this.destination;
          let r;
          try {
            r = this.predicate(t, this.index++);
          } catch (i) {
            return void e.error(i);
          }
          this.nextOrComplete(t, r);
        }
        nextOrComplete(t, e) {
          const r = this.destination;
          Boolean(e) ? r.next(t) : (this.inclusive && r.next(t), r.complete());
        }
      }
      class dH {
        constructor(t) {
          this.value = t;
        }
        call(t, e) {
          return e.subscribe(new hH(t, this.value));
        }
      }
      class hH extends ye {
        constructor(t, e) {
          super(t), (this.value = e);
        }
        _next(t) {
          this.destination.next(this.value);
        }
      }
      const q = "primary",
        Ts = Symbol("RouteTitle");
      class fH {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const e = this.params[t];
            return Array.isArray(e) ? e[0] : e;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const e = this.params[t];
            return Array.isArray(e) ? e : [e];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function io(n) {
        return new fH(n);
      }
      function pH(n, t, e) {
        const r = e.path.split("/");
        if (
          r.length > n.length ||
          ("full" === e.pathMatch && (t.hasChildren() || r.length < n.length))
        )
          return null;
        const i = {};
        for (let o = 0; o < r.length; o++) {
          const s = r[o],
            a = n[o];
          if (s.startsWith(":")) i[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: n.slice(0, r.length), posParams: i };
      }
      function Fn(n, t) {
        const e = n ? Object.keys(n) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!e || !r || e.length != r.length) return !1;
        let i;
        for (let o = 0; o < e.length; o++)
          if (((i = e[o]), !YE(n[i], t[i]))) return !1;
        return !0;
      }
      function YE(n, t) {
        if (Array.isArray(n) && Array.isArray(t)) {
          if (n.length !== t.length) return !1;
          const e = [...n].sort(),
            r = [...t].sort();
          return e.every((i, o) => r[o] === i);
        }
        return n === t;
      }
      function ZE(n) {
        return Array.prototype.concat.apply([], n);
      }
      function XE(n) {
        return n.length > 0 ? n[n.length - 1] : null;
      }
      function Je(n, t) {
        for (const e in n) n.hasOwnProperty(e) && t(n[e], e);
      }
      function wr(n) {
        return Fd(n) ? n : es(n) ? Ue(Promise.resolve(n)) : R(n);
      }
      const cu = !1,
        gH = {
          exact: function tw(n, t, e) {
            if (
              !Xr(n.segments, t.segments) ||
              !du(n.segments, t.segments, e) ||
              n.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!n.children[r] || !tw(n.children[r], t.children[r], e))
                return !1;
            return !0;
          },
          subset: nw,
        },
        JE = {
          exact: function yH(n, t) {
            return Fn(n, t);
          },
          subset: function _H(n, t) {
            return (
              Object.keys(t).length <= Object.keys(n).length &&
              Object.keys(t).every((e) => YE(n[e], t[e]))
            );
          },
          ignored: () => !0,
        };
      function ew(n, t, e) {
        return (
          gH[e.paths](n.root, t.root, e.matrixParams) &&
          JE[e.queryParams](n.queryParams, t.queryParams) &&
          !("exact" === e.fragment && n.fragment !== t.fragment)
        );
      }
      function nw(n, t, e) {
        return rw(n, t, t.segments, e);
      }
      function rw(n, t, e, r) {
        if (n.segments.length > e.length) {
          const i = n.segments.slice(0, e.length);
          return !(!Xr(i, e) || t.hasChildren() || !du(i, e, r));
        }
        if (n.segments.length === e.length) {
          if (!Xr(n.segments, e) || !du(n.segments, e, r)) return !1;
          for (const i in t.children)
            if (!n.children[i] || !nw(n.children[i], t.children[i], r))
              return !1;
          return !0;
        }
        {
          const i = e.slice(0, n.segments.length),
            o = e.slice(n.segments.length);
          return (
            !!(Xr(n.segments, i) && du(n.segments, i, r) && n.children[q]) &&
            rw(n.children[q], t, o, r)
          );
        }
      }
      function du(n, t, e) {
        return t.every((r, i) => JE[e](n[i].parameters, r.parameters));
      }
      class Zr {
        constructor(t = new Q([], {}), e = {}, r = null) {
          (this.root = t), (this.queryParams = e), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = io(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return CH.serialize(this);
        }
      }
      class Q {
        constructor(t, e) {
          (this.segments = t),
            (this.children = e),
            (this.parent = null),
            Je(e, (r, i) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return hu(this);
        }
      }
      class Fs {
        constructor(t, e) {
          (this.path = t), (this.parameters = e);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = io(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return sw(this);
        }
      }
      function Xr(n, t) {
        return n.length === t.length && n.every((e, r) => e.path === t[r].path);
      }
      let xs = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = I({
            token: n,
            factory: function () {
              return new xf();
            },
            providedIn: "root",
          })),
          n
        );
      })();
      class xf {
        parse(t) {
          const e = new FH(t);
          return new Zr(
            e.parseRootSegment(),
            e.parseQueryParams(),
            e.parseFragment()
          );
        }
        serialize(t) {
          const e = `/${Rs(t.root, !0)}`,
            r = (function wH(n) {
              const t = Object.keys(n)
                .map((e) => {
                  const r = n[e];
                  return Array.isArray(r)
                    ? r.map((i) => `${fu(e)}=${fu(i)}`).join("&")
                    : `${fu(e)}=${fu(r)}`;
                })
                .filter((e) => !!e);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams),
            i =
              "string" == typeof t.fragment
                ? `#${(function DH(n) {
                    return encodeURI(n);
                  })(t.fragment)}`
                : "";
          return `${e}${r}${i}`;
        }
      }
      const CH = new xf();
      function hu(n) {
        return n.segments.map((t) => sw(t)).join("/");
      }
      function Rs(n, t) {
        if (!n.hasChildren()) return hu(n);
        if (t) {
          const e = n.children[q] ? Rs(n.children[q], !1) : "",
            r = [];
          return (
            Je(n.children, (i, o) => {
              o !== q && r.push(`${o}:${Rs(i, !1)}`);
            }),
            r.length > 0 ? `${e}(${r.join("//")})` : e
          );
        }
        {
          const e = (function bH(n, t) {
            let e = [];
            return (
              Je(n.children, (r, i) => {
                i === q && (e = e.concat(t(r, i)));
              }),
              Je(n.children, (r, i) => {
                i !== q && (e = e.concat(t(r, i)));
              }),
              e
            );
          })(n, (r, i) =>
            i === q ? [Rs(n.children[q], !1)] : [`${i}:${Rs(r, !1)}`]
          );
          return 1 === Object.keys(n.children).length && null != n.children[q]
            ? `${hu(n)}/${e[0]}`
            : `${hu(n)}/(${e.join("//")})`;
        }
      }
      function iw(n) {
        return encodeURIComponent(n)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function fu(n) {
        return iw(n).replace(/%3B/gi, ";");
      }
      function Rf(n) {
        return iw(n)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function pu(n) {
        return decodeURIComponent(n);
      }
      function ow(n) {
        return pu(n.replace(/\+/g, "%20"));
      }
      function sw(n) {
        return `${Rf(n.path)}${(function EH(n) {
          return Object.keys(n)
            .map((t) => `;${Rf(t)}=${Rf(n[t])}`)
            .join("");
        })(n.parameters)}`;
      }
      const MH = /^[^\/()?;=#]+/;
      function mu(n) {
        const t = n.match(MH);
        return t ? t[0] : "";
      }
      const SH = /^[^=?&#]+/,
        IH = /^[^&#]+/;
      class FH {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new Q([], {})
              : new Q([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let e = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (e = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(e).length > 0) && (r[q] = new Q(t, e)),
            r
          );
        }
        parseSegment() {
          const t = mu(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new b(4009, cu);
          return this.capture(t), new Fs(pu(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const e = mu(this.remaining);
          if (!e) return;
          this.capture(e);
          let r = "";
          if (this.consumeOptional("=")) {
            const i = mu(this.remaining);
            i && ((r = i), this.capture(r));
          }
          t[pu(e)] = pu(r);
        }
        parseQueryParam(t) {
          const e = (function AH(n) {
            const t = n.match(SH);
            return t ? t[0] : "";
          })(this.remaining);
          if (!e) return;
          this.capture(e);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function TH(n) {
              const t = n.match(IH);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const i = ow(e),
            o = ow(r);
          if (t.hasOwnProperty(i)) {
            let s = t[i];
            Array.isArray(s) || ((s = [s]), (t[i] = s)), s.push(o);
          } else t[i] = o;
        }
        parseParens(t) {
          const e = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = mu(this.remaining),
              i = this.remaining[r.length];
            if ("/" !== i && ")" !== i && ";" !== i) throw new b(4010, cu);
            let o;
            r.indexOf(":") > -1
              ? ((o = r.slice(0, r.indexOf(":"))),
                this.capture(o),
                this.capture(":"))
              : t && (o = q);
            const s = this.parseChildren();
            (e[o] = 1 === Object.keys(s).length ? s[q] : new Q([], s)),
              this.consumeOptional("//");
          }
          return e;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new b(4011, cu);
        }
      }
      function Nf(n) {
        return n.segments.length > 0 ? new Q([], { [q]: n }) : n;
      }
      function gu(n) {
        const t = {};
        for (const r of Object.keys(n.children)) {
          const o = gu(n.children[r]);
          (o.segments.length > 0 || o.hasChildren()) && (t[r] = o);
        }
        return (function xH(n) {
          if (1 === n.numberOfChildren && n.children[q]) {
            const t = n.children[q];
            return new Q(n.segments.concat(t.segments), t.children);
          }
          return n;
        })(new Q(n.segments, t));
      }
      function Jr(n) {
        return n instanceof Zr;
      }
      function kH(n, t, e, r, i) {
        if (0 === e.length) return oo(t.root, t.root, t.root, r, i);
        const o = (function uw(n) {
          if ("string" == typeof n[0] && 1 === n.length && "/" === n[0])
            return new lw(!0, 0, n);
          let t = 0,
            e = !1;
          const r = n.reduce((i, o, s) => {
            if ("object" == typeof o && null != o) {
              if (o.outlets) {
                const a = {};
                return (
                  Je(o.outlets, (l, u) => {
                    a[u] = "string" == typeof l ? l.split("/") : l;
                  }),
                  [...i, { outlets: a }]
                );
              }
              if (o.segmentPath) return [...i, o.segmentPath];
            }
            return "string" != typeof o
              ? [...i, o]
              : 0 === s
              ? (o.split("/").forEach((a, l) => {
                  (0 == l && "." === a) ||
                    (0 == l && "" === a
                      ? (e = !0)
                      : ".." === a
                      ? t++
                      : "" != a && i.push(a));
                }),
                i)
              : [...i, o];
          }, []);
          return new lw(e, t, r);
        })(e);
        return o.toRoot()
          ? oo(t.root, t.root, new Q([], {}), r, i)
          : (function s(l) {
              const u = (function PH(n, t, e, r) {
                  if (n.isAbsolute) return new so(t.root, !0, 0);
                  if (-1 === r) return new so(e, e === t.root, 0);
                  return (function cw(n, t, e) {
                    let r = n,
                      i = t,
                      o = e;
                    for (; o > i; ) {
                      if (((o -= i), (r = r.parent), !r)) throw new b(4005, !1);
                      i = r.segments.length;
                    }
                    return new so(r, !1, i - o);
                  })(e, r + (Ns(n.commands[0]) ? 0 : 1), n.numberOfDoubleDots);
                })(o, t, n.snapshot?._urlSegment, l),
                c = u.processChildren
                  ? Os(u.segmentGroup, u.index, o.commands)
                  : Of(u.segmentGroup, u.index, o.commands);
              return oo(t.root, u.segmentGroup, c, r, i);
            })(n.snapshot?._lastPathIndex);
      }
      function Ns(n) {
        return (
          "object" == typeof n && null != n && !n.outlets && !n.segmentPath
        );
      }
      function ks(n) {
        return "object" == typeof n && null != n && n.outlets;
      }
      function oo(n, t, e, r, i) {
        let s,
          o = {};
        r &&
          Je(r, (l, u) => {
            o[u] = Array.isArray(l) ? l.map((c) => `${c}`) : `${l}`;
          }),
          (s = n === t ? e : aw(n, t, e));
        const a = Nf(gu(s));
        return new Zr(a, o, i);
      }
      function aw(n, t, e) {
        const r = {};
        return (
          Je(n.children, (i, o) => {
            r[o] = i === t ? e : aw(i, t, e);
          }),
          new Q(n.segments, r)
        );
      }
      class lw {
        constructor(t, e, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = e),
            (this.commands = r),
            t && r.length > 0 && Ns(r[0]))
          )
            throw new b(4003, !1);
          const i = r.find(ks);
          if (i && i !== XE(r)) throw new b(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class so {
        constructor(t, e, r) {
          (this.segmentGroup = t), (this.processChildren = e), (this.index = r);
        }
      }
      function Of(n, t, e) {
        if (
          (n || (n = new Q([], {})), 0 === n.segments.length && n.hasChildren())
        )
          return Os(n, t, e);
        const r = (function VH(n, t, e) {
            let r = 0,
              i = t;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < n.segments.length; ) {
              if (r >= e.length) return o;
              const s = n.segments[i],
                a = e[r];
              if (ks(a)) break;
              const l = `${a}`,
                u = r < e.length - 1 ? e[r + 1] : null;
              if (i > 0 && void 0 === l) break;
              if (l && u && "object" == typeof u && void 0 === u.outlets) {
                if (!hw(l, u, s)) return o;
                r += 2;
              } else {
                if (!hw(l, {}, s)) return o;
                r++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: r };
          })(n, t, e),
          i = e.slice(r.commandIndex);
        if (r.match && r.pathIndex < n.segments.length) {
          const o = new Q(n.segments.slice(0, r.pathIndex), {});
          return (
            (o.children[q] = new Q(n.segments.slice(r.pathIndex), n.children)),
            Os(o, 0, i)
          );
        }
        return r.match && 0 === i.length
          ? new Q(n.segments, {})
          : r.match && !n.hasChildren()
          ? Pf(n, t, e)
          : r.match
          ? Os(n, 0, i)
          : Pf(n, t, e);
      }
      function Os(n, t, e) {
        if (0 === e.length) return new Q(n.segments, {});
        {
          const r = (function LH(n) {
              return ks(n[0]) ? n[0].outlets : { [q]: n };
            })(e),
            i = {};
          return (
            Je(r, (o, s) => {
              "string" == typeof o && (o = [o]),
                null !== o && (i[s] = Of(n.children[s], t, o));
            }),
            Je(n.children, (o, s) => {
              void 0 === r[s] && (i[s] = o);
            }),
            new Q(n.segments, i)
          );
        }
      }
      function Pf(n, t, e) {
        const r = n.segments.slice(0, t);
        let i = 0;
        for (; i < e.length; ) {
          const o = e[i];
          if (ks(o)) {
            const l = BH(o.outlets);
            return new Q(r, l);
          }
          if (0 === i && Ns(e[0])) {
            r.push(new Fs(n.segments[t].path, dw(e[0]))), i++;
            continue;
          }
          const s = ks(o) ? o.outlets[q] : `${o}`,
            a = i < e.length - 1 ? e[i + 1] : null;
          s && a && Ns(a)
            ? (r.push(new Fs(s, dw(a))), (i += 2))
            : (r.push(new Fs(s, {})), i++);
        }
        return new Q(r, {});
      }
      function BH(n) {
        const t = {};
        return (
          Je(n, (e, r) => {
            "string" == typeof e && (e = [e]),
              null !== e && (t[r] = Pf(new Q([], {}), 0, e));
          }),
          t
        );
      }
      function dw(n) {
        const t = {};
        return Je(n, (e, r) => (t[r] = `${e}`)), t;
      }
      function hw(n, t, e) {
        return n == e.path && Fn(t, e.parameters);
      }
      class Yn {
        constructor(t, e) {
          (this.id = t), (this.url = e);
        }
      }
      class Lf extends Yn {
        constructor(t, e, r = "imperative", i = null) {
          super(t, e),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class ei extends Yn {
        constructor(t, e, r) {
          super(t, e), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class yu extends Yn {
        constructor(t, e, r, i) {
          super(t, e), (this.reason = r), (this.code = i), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class fw extends Yn {
        constructor(t, e, r, i) {
          super(t, e), (this.error = r), (this.target = i), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class HH extends Yn {
        constructor(t, e, r, i) {
          super(t, e),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class UH extends Yn {
        constructor(t, e, r, i) {
          super(t, e),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class jH extends Yn {
        constructor(t, e, r, i, o) {
          super(t, e),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.shouldActivate = o),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class $H extends Yn {
        constructor(t, e, r, i) {
          super(t, e),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class zH extends Yn {
        constructor(t, e, r, i) {
          super(t, e),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class GH {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class qH {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class WH {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class KH {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class QH {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class YH {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class pw {
        constructor(t, e, r) {
          (this.routerEvent = t),
            (this.position = e),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      let XH = (() => {
          class n {
            createUrlTree(e, r, i, o, s, a) {
              return kH(e || r.root, i, o, s, a);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = I({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        JH = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = I({
              token: n,
              factory: function (t) {
                return XH.ɵfac(t);
              },
              providedIn: "root",
            })),
            n
          );
        })();
      class mw {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const e = this.pathFromRoot(t);
          return e.length > 1 ? e[e.length - 2] : null;
        }
        children(t) {
          const e = Vf(t, this._root);
          return e ? e.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const e = Vf(t, this._root);
          return e && e.children.length > 0 ? e.children[0].value : null;
        }
        siblings(t) {
          const e = Bf(t, this._root);
          return e.length < 2
            ? []
            : e[e.length - 2].children
                .map((i) => i.value)
                .filter((i) => i !== t);
        }
        pathFromRoot(t) {
          return Bf(t, this._root).map((e) => e.value);
        }
      }
      function Vf(n, t) {
        if (n === t.value) return t;
        for (const e of t.children) {
          const r = Vf(n, e);
          if (r) return r;
        }
        return null;
      }
      function Bf(n, t) {
        if (n === t.value) return [t];
        for (const e of t.children) {
          const r = Bf(n, e);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class Zn {
        constructor(t, e) {
          (this.value = t), (this.children = e);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function ao(n) {
        const t = {};
        return n && n.children.forEach((e) => (t[e.value.outlet] = e)), t;
      }
      class gw extends mw {
        constructor(t, e) {
          super(t), (this.snapshot = e), Hf(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function yw(n, t) {
        const e = (function e2(n, t) {
            const s = new _u([], {}, {}, "", {}, q, t, null, n.root, -1, {});
            return new vw("", new Zn(s, []));
          })(n, t),
          r = new Kt([new Fs("", {})]),
          i = new Kt({}),
          o = new Kt({}),
          s = new Kt({}),
          a = new Kt(""),
          l = new lo(r, i, s, a, o, q, t, e.root);
        return (l.snapshot = e.root), new gw(new Zn(l, []), e);
      }
      class lo {
        constructor(t, e, r, i, o, s, a, l) {
          (this.url = t),
            (this.params = e),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.title = this.data?.pipe(B((u) => u[Ts])) ?? R(void 0)),
            (this._futureSnapshot = l);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(B((t) => io(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(B((t) => io(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function _w(n, t = "emptyOnly") {
        const e = n.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = e.length - 1; r >= 1; ) {
            const i = e[r],
              o = e[r - 1];
            if (i.routeConfig && "" === i.routeConfig.path) r--;
            else {
              if (o.component) break;
              r--;
            }
          }
        return (function t2(n) {
          return n.reduce(
            (t, e) => ({
              params: { ...t.params, ...e.params },
              data: { ...t.data, ...e.data },
              resolve: {
                ...e.data,
                ...t.resolve,
                ...e.routeConfig?.data,
                ...e._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(e.slice(r));
      }
      class _u {
        constructor(t, e, r, i, o, s, a, l, u, c, d) {
          (this.url = t),
            (this.params = e),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._urlSegment = u),
            (this._lastPathIndex = c),
            (this._resolve = d);
        }
        get title() {
          return this.data?.[Ts];
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = io(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = io(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class vw extends mw {
        constructor(t, e) {
          super(e), (this.url = t), Hf(this, e);
        }
        toString() {
          return bw(this._root);
        }
      }
      function Hf(n, t) {
        (t.value._routerState = n), t.children.forEach((e) => Hf(n, e));
      }
      function bw(n) {
        const t =
          n.children.length > 0 ? ` { ${n.children.map(bw).join(", ")} } ` : "";
        return `${n.value}${t}`;
      }
      function Uf(n) {
        if (n.snapshot) {
          const t = n.snapshot,
            e = n._futureSnapshot;
          (n.snapshot = e),
            Fn(t.queryParams, e.queryParams) ||
              n.queryParams.next(e.queryParams),
            t.fragment !== e.fragment && n.fragment.next(e.fragment),
            Fn(t.params, e.params) || n.params.next(e.params),
            (function mH(n, t) {
              if (n.length !== t.length) return !1;
              for (let e = 0; e < n.length; ++e) if (!Fn(n[e], t[e])) return !1;
              return !0;
            })(t.url, e.url) || n.url.next(e.url),
            Fn(t.data, e.data) || n.data.next(e.data);
        } else
          (n.snapshot = n._futureSnapshot), n.data.next(n._futureSnapshot.data);
      }
      function jf(n, t) {
        const e =
          Fn(n.params, t.params) &&
          (function vH(n, t) {
            return (
              Xr(n, t) && n.every((e, r) => Fn(e.parameters, t[r].parameters))
            );
          })(n.url, t.url);
        return (
          e &&
          !(!n.parent != !t.parent) &&
          (!n.parent || jf(n.parent, t.parent))
        );
      }
      function Ps(n, t, e) {
        if (e && n.shouldReuseRoute(t.value, e.value.snapshot)) {
          const r = e.value;
          r._futureSnapshot = t.value;
          const i = (function r2(n, t, e) {
            return t.children.map((r) => {
              for (const i of e.children)
                if (n.shouldReuseRoute(r.value, i.value.snapshot))
                  return Ps(n, r, i);
              return Ps(n, r);
            });
          })(n, t, e);
          return new Zn(r, i);
        }
        {
          if (n.shouldAttach(t.value)) {
            const o = n.retrieve(t.value);
            if (null !== o) {
              const s = o.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => Ps(n, a))),
                s
              );
            }
          }
          const r = (function o2(n) {
              return new lo(
                new Kt(n.url),
                new Kt(n.params),
                new Kt(n.queryParams),
                new Kt(n.fragment),
                new Kt(n.data),
                n.outlet,
                n.component,
                n
              );
            })(t.value),
            i = t.children.map((o) => Ps(n, o));
          return new Zn(r, i);
        }
      }
      const $f = "ngNavigationCancelingError";
      function Cw(n, t) {
        const { redirectTo: e, navigationBehaviorOptions: r } = Jr(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          i = Dw(!1, 0, t);
        return (i.url = e), (i.navigationBehaviorOptions = r), i;
      }
      function Dw(n, t, e) {
        const r = new Error("NavigationCancelingError: " + (n || ""));
        return (r[$f] = !0), (r.cancellationCode = t), e && (r.url = e), r;
      }
      function Ew(n) {
        return ww(n) && Jr(n.url);
      }
      function ww(n) {
        return n && n[$f];
      }
      class s2 {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.injector = null),
            (this.children = new Ls()),
            (this.attachRef = null);
        }
      }
      let Ls = (() => {
        class n {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(e, r) {
            const i = this.getOrCreateContext(e);
            (i.outlet = r), this.contexts.set(e, i);
          }
          onChildOutletDestroyed(e) {
            const r = this.getContext(e);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const e = this.contexts;
            return (this.contexts = new Map()), e;
          }
          onOutletReAttached(e) {
            this.contexts = e;
          }
          getOrCreateContext(e) {
            let r = this.getContext(e);
            return r || ((r = new s2()), this.contexts.set(e, r)), r;
          }
          getContext(e) {
            return this.contexts.get(e) || null;
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const vu = !1;
      let Mw = (() => {
        class n {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = q),
              (this.activateEvents = new pe()),
              (this.deactivateEvents = new pe()),
              (this.attachEvents = new pe()),
              (this.detachEvents = new pe()),
              (this.parentContexts = Y(Ls)),
              (this.location = Y(dn)),
              (this.changeDetector = Y(jr)),
              (this.environmentInjector = Y(Bn));
          }
          ngOnChanges(e) {
            if (e.name) {
              const { firstChange: r, previousValue: i } = e.name;
              if (r) return;
              this.isTrackedInParentContexts(i) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(i)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name);
          }
          isTrackedInParentContexts(e) {
            return this.parentContexts.getContext(e)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const e = this.parentContexts.getContext(this.name);
            e?.route &&
              (e.attachRef
                ? this.attach(e.attachRef, e.route)
                : this.activateWith(e.route, e.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new b(4012, vu);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new b(4012, vu);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new b(4012, vu);
            this.location.detach();
            const e = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(e.instance),
              e
            );
          }
          attach(e, r) {
            (this.activated = e),
              (this._activatedRoute = r),
              this.location.insert(e.hostView),
              this.attachEvents.emit(e.instance);
          }
          deactivate() {
            if (this.activated) {
              const e = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(e);
            }
          }
          activateWith(e, r) {
            if (this.isActivated) throw new b(4013, vu);
            this._activatedRoute = e;
            const i = this.location,
              s = e.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new a2(e, a, i.injector);
            if (
              r &&
              (function l2(n) {
                return !!n.resolveComponentFactory;
              })(r)
            ) {
              const u = r.resolveComponentFactory(s);
              this.activated = i.createComponent(u, i.length, l);
            } else
              this.activated = i.createComponent(s, {
                index: i.length,
                injector: l,
                environmentInjector: r ?? this.environmentInjector,
              });
            this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵdir = M({
            type: n,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [Dt],
          })),
          n
        );
      })();
      class a2 {
        constructor(t, e, r) {
          (this.route = t), (this.childContexts = e), (this.parent = r);
        }
        get(t, e) {
          return t === lo
            ? this.route
            : t === Ls
            ? this.childContexts
            : this.parent.get(t, e);
        }
      }
      let zf = (() => {
        class n {}
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵcmp = Qe({
            type: n,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [cv],
            decls: 1,
            vars: 0,
            template: function (e, r) {
              1 & e && kt(0, "router-outlet");
            },
            dependencies: [Mw],
            encapsulation: 2,
          })),
          n
        );
      })();
      function Sw(n, t) {
        return (
          n.providers &&
            !n._injector &&
            (n._injector = il(n.providers, t, `Route: ${n.path}`)),
          n._injector ?? t
        );
      }
      function qf(n) {
        const t = n.children && n.children.map(qf),
          e = t ? { ...n, children: t } : { ...n };
        return (
          !e.component &&
            !e.loadComponent &&
            (t || e.loadChildren) &&
            e.outlet &&
            e.outlet !== q &&
            (e.component = zf),
          e
        );
      }
      function Yt(n) {
        return n.outlet || q;
      }
      function Aw(n, t) {
        const e = n.filter((r) => Yt(r) === t);
        return e.push(...n.filter((r) => Yt(r) !== t)), e;
      }
      function Vs(n) {
        if (!n) return null;
        if (n.routeConfig?._injector) return n.routeConfig._injector;
        for (let t = n.parent; t; t = t.parent) {
          const e = t.routeConfig;
          if (e?._loadedInjector) return e._loadedInjector;
          if (e?._injector) return e._injector;
        }
        return null;
      }
      class f2 {
        constructor(t, e, r, i) {
          (this.routeReuseStrategy = t),
            (this.futureState = e),
            (this.currState = r),
            (this.forwardEvent = i);
        }
        activate(t) {
          const e = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(e, r, t),
            Uf(this.futureState.root),
            this.activateChildRoutes(e, r, t);
        }
        deactivateChildRoutes(t, e, r) {
          const i = ao(e);
          t.children.forEach((o) => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, i[s], r), delete i[s];
          }),
            Je(i, (o, s) => {
              this.deactivateRouteAndItsChildren(o, r);
            });
        }
        deactivateRoutes(t, e, r) {
          const i = t.value,
            o = e ? e.value : null;
          if (i === o)
            if (i.component) {
              const s = r.getContext(i.outlet);
              s && this.deactivateChildRoutes(t, e, s.children);
            } else this.deactivateChildRoutes(t, e, r);
          else o && this.deactivateRouteAndItsChildren(e, r);
        }
        deactivateRouteAndItsChildren(t, e) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, e)
            : this.deactivateRouteAndOutlet(t, e);
        }
        detachAndStoreRouteSubtree(t, e) {
          const r = e.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : e,
            o = ao(t);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, e) {
          const r = e.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : e,
            o = ao(t);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(t, e, r) {
          const i = ao(e);
          t.children.forEach((o) => {
            this.activateRoutes(o, i[o.value.outlet], r),
              this.forwardEvent(new YH(o.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new KH(t.value.snapshot));
        }
        activateRoutes(t, e, r) {
          const i = t.value,
            o = e ? e.value : null;
          if ((Uf(i), i === o))
            if (i.component) {
              const s = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(t, e, s.children);
            } else this.activateChildRoutes(t, e, r);
          else if (i.component) {
            const s = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Uf(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = Vs(i.snapshot),
                l = a?.get(Go) ?? null;
              (s.attachRef = null),
                (s.route = i),
                (s.resolver = l),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(i, s.injector),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class Iw {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class bu {
        constructor(t, e) {
          (this.component = t), (this.route = e);
        }
      }
      function p2(n, t, e) {
        const r = n._root;
        return Bs(r, t ? t._root : null, e, [r.value]);
      }
      function uo(n, t) {
        const e = Symbol(),
          r = t.get(n, e);
        return r === e
          ? "function" != typeof n ||
            (function DS(n) {
              return null !== la(n);
            })(n)
            ? t.get(n)
            : n
          : r;
      }
      function Bs(
        n,
        t,
        e,
        r,
        i = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const o = ao(t);
        return (
          n.children.forEach((s) => {
            (function g2(
              n,
              t,
              e,
              r,
              i = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const o = n.value,
                s = t ? t.value : null,
                a = e ? e.getContext(n.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const l = (function y2(n, t, e) {
                  if ("function" == typeof e) return e(n, t);
                  switch (e) {
                    case "pathParamsChange":
                      return !Xr(n.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !Xr(n.url, t.url) || !Fn(n.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !jf(n, t) || !Fn(n.queryParams, t.queryParams);
                    default:
                      return !jf(n, t);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                l
                  ? i.canActivateChecks.push(new Iw(r))
                  : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  Bs(n, t, o.component ? (a ? a.children : null) : e, r, i),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new bu(a.outlet.component, s));
              } else
                s && Hs(t, a, i),
                  i.canActivateChecks.push(new Iw(r)),
                  Bs(n, null, o.component ? (a ? a.children : null) : e, r, i);
            })(s, o[s.value.outlet], e, r.concat([s.value]), i),
              delete o[s.value.outlet];
          }),
          Je(o, (s, a) => Hs(s, e.getContext(a), i)),
          i
        );
      }
      function Hs(n, t, e) {
        const r = ao(n),
          i = n.value;
        Je(r, (o, s) => {
          Hs(o, i.component ? (t ? t.children.getContext(s) : null) : t, e);
        }),
          e.canDeactivateChecks.push(
            new bu(
              i.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              i
            )
          );
      }
      function Us(n) {
        return "function" == typeof n;
      }
      function Wf(n) {
        return n instanceof lu || "EmptyError" === n?.name;
      }
      const Cu = Symbol("INITIAL_VALUE");
      function co() {
        return gn((n) =>
          GE(n.map((t) => t.pipe(fr(1), Bl(Cu)))).pipe(
            B((t) => {
              for (const e of t)
                if (!0 !== e) {
                  if (e === Cu) return Cu;
                  if (!1 === e || e instanceof Zr) return e;
                }
              return !0;
            }),
            Qn((t) => t !== Cu),
            fr(1)
          )
        );
      }
      function Tw(n) {
        return (function qM(...n) {
          return xp(n);
        })(
          We((t) => {
            if (Jr(t)) throw Cw(0, t);
          }),
          B((t) => !0 === t)
        );
      }
      const Kf = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function Fw(n, t, e, r, i) {
        const o = Qf(n, t, e);
        return o.matched
          ? (function k2(n, t, e, r) {
              const i = t.canMatch;
              return i && 0 !== i.length
                ? R(
                    i.map((s) => {
                      const a = uo(s, n);
                      return wr(
                        (function E2(n) {
                          return n && Us(n.canMatch);
                        })(a)
                          ? a.canMatch(t, e)
                          : n.runInContext(() => a(t, e))
                      );
                    })
                  ).pipe(co(), Tw())
                : R(!0);
            })((r = Sw(t, r)), t, e).pipe(B((s) => (!0 === s ? o : { ...Kf })))
          : R(o);
      }
      function Qf(n, t, e) {
        if ("" === t.path)
          return "full" === t.pathMatch && (n.hasChildren() || e.length > 0)
            ? { ...Kf }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: e,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (t.matcher || pH)(e, n, t);
        if (!i) return { ...Kf };
        const o = {};
        Je(i.posParams, (a, l) => {
          o[l] = a.path;
        });
        const s =
          i.consumed.length > 0
            ? { ...o, ...i.consumed[i.consumed.length - 1].parameters }
            : o;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: e.slice(i.consumed.length),
          parameters: s,
          positionalParamSegments: i.posParams ?? {},
        };
      }
      function Du(n, t, e, r) {
        if (
          e.length > 0 &&
          (function L2(n, t, e) {
            return e.some((r) => Eu(n, t, r) && Yt(r) !== q);
          })(n, e, r)
        ) {
          const o = new Q(
            t,
            (function P2(n, t, e, r) {
              const i = {};
              (i[q] = r),
                (r._sourceSegment = n),
                (r._segmentIndexShift = t.length);
              for (const o of e)
                if ("" === o.path && Yt(o) !== q) {
                  const s = new Q([], {});
                  (s._sourceSegment = n),
                    (s._segmentIndexShift = t.length),
                    (i[Yt(o)] = s);
                }
              return i;
            })(n, t, r, new Q(e, n.children))
          );
          return (
            (o._sourceSegment = n),
            (o._segmentIndexShift = t.length),
            { segmentGroup: o, slicedSegments: [] }
          );
        }
        if (
          0 === e.length &&
          (function V2(n, t, e) {
            return e.some((r) => Eu(n, t, r));
          })(n, e, r)
        ) {
          const o = new Q(
            n.segments,
            (function O2(n, t, e, r, i) {
              const o = {};
              for (const s of r)
                if (Eu(n, e, s) && !i[Yt(s)]) {
                  const a = new Q([], {});
                  (a._sourceSegment = n),
                    (a._segmentIndexShift = t.length),
                    (o[Yt(s)] = a);
                }
              return { ...i, ...o };
            })(n, t, e, r, n.children)
          );
          return (
            (o._sourceSegment = n),
            (o._segmentIndexShift = t.length),
            { segmentGroup: o, slicedSegments: e }
          );
        }
        const i = new Q(n.segments, n.children);
        return (
          (i._sourceSegment = n),
          (i._segmentIndexShift = t.length),
          { segmentGroup: i, slicedSegments: e }
        );
      }
      function Eu(n, t, e) {
        return (
          (!(n.hasChildren() || t.length > 0) || "full" !== e.pathMatch) &&
          "" === e.path
        );
      }
      function xw(n, t, e, r) {
        return (
          !!(Yt(n) === r || (r !== q && Eu(t, e, n))) &&
          ("**" === n.path || Qf(t, n, e).matched)
        );
      }
      function Rw(n, t, e) {
        return 0 === t.length && !n.children[e];
      }
      const wu = !1;
      class Mu {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class Nw {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function js(n) {
        return to(new Mu(n));
      }
      function kw(n) {
        return to(new Nw(n));
      }
      class j2 {
        constructor(t, e, r, i, o) {
          (this.injector = t),
            (this.configLoader = e),
            (this.urlSerializer = r),
            (this.urlTree = i),
            (this.config = o),
            (this.allowRedirects = !0);
        }
        apply() {
          const t = Du(this.urlTree.root, [], [], this.config).segmentGroup,
            e = new Q(t.segments, t.children);
          return this.expandSegmentGroup(this.injector, this.config, e, q)
            .pipe(
              B((o) =>
                this.createUrlTree(
                  gu(o),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              vr((o) => {
                if (o instanceof Nw)
                  return (this.allowRedirects = !1), this.match(o.urlTree);
                throw o instanceof Mu ? this.noMatchError(o) : o;
              })
            );
        }
        match(t) {
          return this.expandSegmentGroup(this.injector, this.config, t.root, q)
            .pipe(
              B((i) => this.createUrlTree(gu(i), t.queryParams, t.fragment))
            )
            .pipe(
              vr((i) => {
                throw i instanceof Mu ? this.noMatchError(i) : i;
              })
            );
        }
        noMatchError(t) {
          return new b(4002, wu);
        }
        createUrlTree(t, e, r) {
          const i = Nf(t);
          return new Zr(i, e, r);
        }
        expandSegmentGroup(t, e, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(t, e, r).pipe(B((o) => new Q([], o)))
            : this.expandSegment(t, r, e, r.segments, i, !0);
        }
        expandChildren(t, e, r) {
          const i = [];
          for (const o of Object.keys(r.children))
            "primary" === o ? i.unshift(o) : i.push(o);
          return Ue(i).pipe(
            br((o) => {
              const s = r.children[o],
                a = Aw(e, o);
              return this.expandSegmentGroup(t, a, s, o).pipe(
                B((l) => ({ segment: l, outlet: o }))
              );
            }),
            KE((o, s) => ((o[s.outlet] = s.segment), o), {}),
            QE()
          );
        }
        expandSegment(t, e, r, i, o, s) {
          return Ue(r).pipe(
            br((a) =>
              this.expandSegmentAgainstRoute(t, e, r, a, i, o, s).pipe(
                vr((u) => {
                  if (u instanceof Mu) return R(null);
                  throw u;
                })
              )
            ),
            Er((a) => !!a),
            vr((a, l) => {
              if (Wf(a)) return Rw(e, i, o) ? R(new Q([], {})) : js(e);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(t, e, r, i, o, s, a) {
          return xw(i, e, o, s)
            ? void 0 === i.redirectTo
              ? this.matchSegmentAgainstRoute(t, e, i, o, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, e, r, i, o, s)
              : js(e)
            : js(e);
        }
        expandSegmentAgainstRouteUsingRedirect(t, e, r, i, o, s) {
          return "**" === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, i, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                e,
                r,
                i,
                o,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, e, r, i) {
          const o = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? kw(o)
            : this.lineralizeSegments(r, o).pipe(
                et((s) => {
                  const a = new Q(s, {});
                  return this.expandSegment(t, a, e, s, i, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, e, r, i, o, s) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: u,
            positionalParamSegments: c,
          } = Qf(e, i, o);
          if (!a) return js(e);
          const d = this.applyRedirectCommands(l, i.redirectTo, c);
          return i.redirectTo.startsWith("/")
            ? kw(d)
            : this.lineralizeSegments(i, d).pipe(
                et((h) => this.expandSegment(t, e, r, h.concat(u), s, !1))
              );
        }
        matchSegmentAgainstRoute(t, e, r, i, o) {
          return "**" === r.path
            ? ((t = Sw(r, t)),
              r.loadChildren
                ? (r._loadedRoutes
                    ? R({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector,
                      })
                    : this.configLoader.loadChildren(t, r)
                  ).pipe(
                    B(
                      (a) => (
                        (r._loadedRoutes = a.routes),
                        (r._loadedInjector = a.injector),
                        new Q(i, {})
                      )
                    )
                  )
                : R(new Q(i, {})))
            : Fw(e, r, i, t).pipe(
                gn(
                  ({ matched: s, consumedSegments: a, remainingSegments: l }) =>
                    s
                      ? this.getChildConfig((t = r._injector ?? t), r, i).pipe(
                          et((c) => {
                            const d = c.injector ?? t,
                              h = c.routes,
                              { segmentGroup: f, slicedSegments: p } = Du(
                                e,
                                a,
                                l,
                                h
                              ),
                              m = new Q(f.segments, f.children);
                            if (0 === p.length && m.hasChildren())
                              return this.expandChildren(d, h, m).pipe(
                                B((_) => new Q(a, _))
                              );
                            if (0 === h.length && 0 === p.length)
                              return R(new Q(a, {}));
                            const y = Yt(r) === o;
                            return this.expandSegment(
                              d,
                              m,
                              h,
                              p,
                              y ? q : o,
                              !0
                            ).pipe(
                              B((E) => new Q(a.concat(E.segments), E.children))
                            );
                          })
                        )
                      : js(e)
                )
              );
        }
        getChildConfig(t, e, r) {
          return e.children
            ? R({ routes: e.children, injector: t })
            : e.loadChildren
            ? void 0 !== e._loadedRoutes
              ? R({ routes: e._loadedRoutes, injector: e._loadedInjector })
              : (function N2(n, t, e, r) {
                  const i = t.canLoad;
                  return void 0 === i || 0 === i.length
                    ? R(!0)
                    : R(
                        i.map((s) => {
                          const a = uo(s, n);
                          return wr(
                            (function v2(n) {
                              return n && Us(n.canLoad);
                            })(a)
                              ? a.canLoad(t, e)
                              : n.runInContext(() => a(t, e))
                          );
                        })
                      ).pipe(co(), Tw());
                })(t, e, r).pipe(
                  et((i) =>
                    i
                      ? this.configLoader.loadChildren(t, e).pipe(
                          We((o) => {
                            (e._loadedRoutes = o.routes),
                              (e._loadedInjector = o.injector);
                          })
                        )
                      : (function H2(n) {
                          return to(Dw(wu, 3));
                        })()
                  )
                )
            : R({ routes: [], injector: t });
        }
        lineralizeSegments(t, e) {
          let r = [],
            i = e.root;
          for (;;) {
            if (((r = r.concat(i.segments)), 0 === i.numberOfChildren))
              return R(r);
            if (i.numberOfChildren > 1 || !i.children[q])
              return to(new b(4e3, wu));
            i = i.children[q];
          }
        }
        applyRedirectCommands(t, e, r) {
          return this.applyRedirectCreateUrlTree(
            e,
            this.urlSerializer.parse(e),
            t,
            r
          );
        }
        applyRedirectCreateUrlTree(t, e, r, i) {
          const o = this.createSegmentGroup(t, e.root, r, i);
          return new Zr(
            o,
            this.createQueryParams(e.queryParams, this.urlTree.queryParams),
            e.fragment
          );
        }
        createQueryParams(t, e) {
          const r = {};
          return (
            Je(t, (i, o) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[o] = e[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(t, e, r, i) {
          const o = this.createSegments(t, e.segments, r, i);
          let s = {};
          return (
            Je(e.children, (a, l) => {
              s[l] = this.createSegmentGroup(t, a, r, i);
            }),
            new Q(o, s)
          );
        }
        createSegments(t, e, r, i) {
          return e.map((o) =>
            o.path.startsWith(":")
              ? this.findPosParam(t, o, i)
              : this.findOrReturn(o, r)
          );
        }
        findPosParam(t, e, r) {
          const i = r[e.path.substring(1)];
          if (!i) throw new b(4001, wu);
          return i;
        }
        findOrReturn(t, e) {
          let r = 0;
          for (const i of e) {
            if (i.path === t.path) return e.splice(r), i;
            r++;
          }
          return t;
        }
      }
      class z2 {}
      class W2 {
        constructor(t, e, r, i, o, s, a) {
          (this.injector = t),
            (this.rootComponentType = e),
            (this.config = r),
            (this.urlTree = i),
            (this.url = o),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a);
        }
        recognize() {
          const t = Du(
            this.urlTree.root,
            [],
            [],
            this.config.filter((e) => void 0 === e.redirectTo)
          ).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t,
            q
          ).pipe(
            B((e) => {
              if (null === e) return null;
              const r = new _u(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  q,
                  this.rootComponentType,
                  null,
                  this.urlTree.root,
                  -1,
                  {}
                ),
                i = new Zn(r, e),
                o = new vw(this.url, i);
              return this.inheritParamsAndData(o._root), o;
            })
          );
        }
        inheritParamsAndData(t) {
          const e = t.value,
            r = _w(e, this.paramsInheritanceStrategy);
          (e.params = Object.freeze(r.params)),
            (e.data = Object.freeze(r.data)),
            t.children.forEach((i) => this.inheritParamsAndData(i));
        }
        processSegmentGroup(t, e, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(t, e, r)
            : this.processSegment(t, e, r, r.segments, i);
        }
        processChildren(t, e, r) {
          return Ue(Object.keys(r.children)).pipe(
            br((i) => {
              const o = r.children[i],
                s = Aw(e, i);
              return this.processSegmentGroup(t, s, o, i);
            }),
            KE((i, o) => (i && o ? (i.push(...o), i) : null)),
            (function aH(n, t = !1) {
              return (e) => e.lift(new lH(n, t));
            })((i) => null !== i),
            uu(null),
            QE(),
            B((i) => {
              if (null === i) return null;
              const o = Pw(i);
              return (
                (function K2(n) {
                  n.sort((t, e) =>
                    t.value.outlet === q
                      ? -1
                      : e.value.outlet === q
                      ? 1
                      : t.value.outlet.localeCompare(e.value.outlet)
                  );
                })(o),
                o
              );
            })
          );
        }
        processSegment(t, e, r, i, o) {
          return Ue(e).pipe(
            br((s) =>
              this.processSegmentAgainstRoute(s._injector ?? t, s, r, i, o)
            ),
            Er((s) => !!s),
            vr((s) => {
              if (Wf(s)) return Rw(r, i, o) ? R([]) : R(null);
              throw s;
            })
          );
        }
        processSegmentAgainstRoute(t, e, r, i, o) {
          if (e.redirectTo || !xw(e, r, i, o)) return R(null);
          let s;
          if ("**" === e.path) {
            const a = i.length > 0 ? XE(i).parameters : {},
              l = Vw(r) + i.length;
            s = R({
              snapshot: new _u(
                i,
                a,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                Bw(e),
                Yt(e),
                e.component ?? e._loadedComponent ?? null,
                e,
                Lw(r),
                l,
                Hw(e)
              ),
              consumedSegments: [],
              remainingSegments: [],
            });
          } else
            s = Fw(r, e, i, t).pipe(
              B(
                ({
                  matched: a,
                  consumedSegments: l,
                  remainingSegments: u,
                  parameters: c,
                }) => {
                  if (!a) return null;
                  const d = Vw(r) + l.length;
                  return {
                    snapshot: new _u(
                      l,
                      c,
                      Object.freeze({ ...this.urlTree.queryParams }),
                      this.urlTree.fragment,
                      Bw(e),
                      Yt(e),
                      e.component ?? e._loadedComponent ?? null,
                      e,
                      Lw(r),
                      d,
                      Hw(e)
                    ),
                    consumedSegments: l,
                    remainingSegments: u,
                  };
                }
              )
            );
          return s.pipe(
            gn((a) => {
              if (null === a) return R(null);
              const {
                snapshot: l,
                consumedSegments: u,
                remainingSegments: c,
              } = a;
              t = e._injector ?? t;
              const d = e._loadedInjector ?? t,
                h = (function Q2(n) {
                  return n.children
                    ? n.children
                    : n.loadChildren
                    ? n._loadedRoutes
                    : [];
                })(e),
                { segmentGroup: f, slicedSegments: p } = Du(
                  r,
                  u,
                  c,
                  h.filter((y) => void 0 === y.redirectTo)
                );
              if (0 === p.length && f.hasChildren())
                return this.processChildren(d, h, f).pipe(
                  B((y) => (null === y ? null : [new Zn(l, y)]))
                );
              if (0 === h.length && 0 === p.length) return R([new Zn(l, [])]);
              const m = Yt(e) === o;
              return this.processSegment(d, h, f, p, m ? q : o).pipe(
                B((y) => (null === y ? null : [new Zn(l, y)]))
              );
            })
          );
        }
      }
      function Y2(n) {
        const t = n.value.routeConfig;
        return t && "" === t.path && void 0 === t.redirectTo;
      }
      function Pw(n) {
        const t = [],
          e = new Set();
        for (const r of n) {
          if (!Y2(r)) {
            t.push(r);
            continue;
          }
          const i = t.find((o) => r.value.routeConfig === o.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), e.add(i)) : t.push(r);
        }
        for (const r of e) {
          const i = Pw(r.children);
          t.push(new Zn(r.value, i));
        }
        return t.filter((r) => !e.has(r));
      }
      function Lw(n) {
        let t = n;
        for (; t._sourceSegment; ) t = t._sourceSegment;
        return t;
      }
      function Vw(n) {
        let t = n,
          e = t._segmentIndexShift ?? 0;
        for (; t._sourceSegment; )
          (t = t._sourceSegment), (e += t._segmentIndexShift ?? 0);
        return e - 1;
      }
      function Bw(n) {
        return n.data || {};
      }
      function Hw(n) {
        return n.resolve || {};
      }
      function Uw(n) {
        return "string" == typeof n.title || null === n.title;
      }
      function Yf(n) {
        return gn((t) => {
          const e = n(t);
          return e ? Ue(e).pipe(B(() => t)) : R(t);
        });
      }
      const ho = new w("ROUTES");
      let Zf = (() => {
        class n {
          constructor(e, r) {
            (this.injector = e),
              (this.compiler = r),
              (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap());
          }
          loadComponent(e) {
            if (this.componentLoaders.get(e))
              return this.componentLoaders.get(e);
            if (e._loadedComponent) return R(e._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(e);
            const r = wr(e.loadComponent()).pipe(
                B($w),
                We((o) => {
                  this.onLoadEndListener && this.onLoadEndListener(e),
                    (e._loadedComponent = o);
                }),
                nu(() => {
                  this.componentLoaders.delete(e);
                })
              ),
              i = new Ku(r, () => new He()).pipe(ia());
            return this.componentLoaders.set(e, i), i;
          }
          loadChildren(e, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return R({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const o = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                B((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let l,
                    u,
                    c = !1;
                  Array.isArray(a)
                    ? (u = a)
                    : ((l = a.create(e).injector),
                      (u = ZE(l.get(ho, [], P.Self | P.Optional))));
                  return { routes: u.map(qf), injector: l };
                }),
                nu(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new Ku(o, () => new He()).pipe(ia());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(e) {
            return wr(e()).pipe(
              B($w),
              et((i) =>
                i instanceof lv || Array.isArray(i)
                  ? R(i)
                  : Ue(this.compiler.compileModuleAsync(i))
              )
            );
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(zt), v(Jv));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function $w(n) {
        return (function oU(n) {
          return n && "object" == typeof n && "default" in n;
        })(n)
          ? n.default
          : n;
      }
      let Xf = (() => {
        class n {
          constructor() {
            (this.currentNavigation = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new He()),
              (this.configLoader = Y(Zf)),
              (this.environmentInjector = Y(Bn)),
              (this.urlSerializer = Y(xs)),
              (this.rootContexts = Y(Ls)),
              (this.navigationId = 0),
              (this.configLoader.onLoadEndListener = (i) =>
                this.events.next(new qH(i))),
              (this.configLoader.onLoadStartListener = (i) =>
                this.events.next(new GH(i)));
          }
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(e) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...e, id: r });
          }
          setupNavigations(e) {
            return (
              (this.transitions = new Kt({
                id: 0,
                targetPageId: 0,
                currentUrlTree: e.currentUrlTree,
                currentRawUrl: e.currentUrlTree,
                extractedUrl: e.urlHandlingStrategy.extract(e.currentUrlTree),
                urlAfterRedirects: e.urlHandlingStrategy.extract(
                  e.currentUrlTree
                ),
                rawUrl: e.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: "imperative",
                restoredState: null,
                currentSnapshot: e.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: e.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                Qn((r) => 0 !== r.id),
                B((r) => ({
                  ...r,
                  extractedUrl: e.urlHandlingStrategy.extract(r.rawUrl),
                })),
                gn((r) => {
                  let i = !1,
                    o = !1;
                  return R(r).pipe(
                    We((s) => {
                      this.currentNavigation = {
                        id: s.id,
                        initialUrl: s.rawUrl,
                        extractedUrl: s.extractedUrl,
                        trigger: s.source,
                        extras: s.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    gn((s) => {
                      const a = e.browserUrlTree.toString(),
                        l =
                          !e.navigated ||
                          s.extractedUrl.toString() !== a ||
                          a !== e.currentUrlTree.toString();
                      if (
                        ("reload" === e.onSameUrlNavigation || l) &&
                        e.urlHandlingStrategy.shouldProcessUrl(s.rawUrl)
                      )
                        return (
                          Gw(s.source) && (e.browserUrlTree = s.extractedUrl),
                          R(s).pipe(
                            gn((c) => {
                              const d = this.transitions?.getValue();
                              return (
                                this.events.next(
                                  new Lf(
                                    c.id,
                                    this.urlSerializer.serialize(
                                      c.extractedUrl
                                    ),
                                    c.source,
                                    c.restoredState
                                  )
                                ),
                                d !== this.transitions?.getValue()
                                  ? Gr
                                  : Promise.resolve(c)
                              );
                            }),
                            (function $2(n, t, e, r) {
                              return gn((i) =>
                                (function U2(n, t, e, r, i) {
                                  return new j2(n, t, e, r, i).apply();
                                })(n, t, e, i.extractedUrl, r).pipe(
                                  B((o) => ({ ...i, urlAfterRedirects: o }))
                                )
                              );
                            })(
                              this.environmentInjector,
                              this.configLoader,
                              this.urlSerializer,
                              e.config
                            ),
                            We((c) => {
                              (this.currentNavigation = {
                                ...this.currentNavigation,
                                finalUrl: c.urlAfterRedirects,
                              }),
                                (r.urlAfterRedirects = c.urlAfterRedirects);
                            }),
                            (function X2(n, t, e, r, i) {
                              return et((o) =>
                                (function q2(
                                  n,
                                  t,
                                  e,
                                  r,
                                  i,
                                  o,
                                  s = "emptyOnly"
                                ) {
                                  return new W2(n, t, e, r, i, s, o)
                                    .recognize()
                                    .pipe(
                                      gn((a) =>
                                        null === a
                                          ? (function G2(n) {
                                              return new we((t) => t.error(n));
                                            })(new z2())
                                          : R(a)
                                      )
                                    );
                                })(
                                  n,
                                  t,
                                  e,
                                  o.urlAfterRedirects,
                                  r.serialize(o.urlAfterRedirects),
                                  r,
                                  i
                                ).pipe(B((s) => ({ ...o, targetSnapshot: s })))
                              );
                            })(
                              this.environmentInjector,
                              e.rootComponentType,
                              e.config,
                              this.urlSerializer,
                              e.paramsInheritanceStrategy
                            ),
                            We((c) => {
                              if (
                                ((r.targetSnapshot = c.targetSnapshot),
                                "eager" === e.urlUpdateStrategy)
                              ) {
                                if (!c.extras.skipLocationChange) {
                                  const h = e.urlHandlingStrategy.merge(
                                    c.urlAfterRedirects,
                                    c.rawUrl
                                  );
                                  e.setBrowserUrl(h, c);
                                }
                                e.browserUrlTree = c.urlAfterRedirects;
                              }
                              const d = new HH(
                                c.id,
                                this.urlSerializer.serialize(c.extractedUrl),
                                this.urlSerializer.serialize(
                                  c.urlAfterRedirects
                                ),
                                c.targetSnapshot
                              );
                              this.events.next(d);
                            })
                          )
                        );
                      if (
                        l &&
                        e.rawUrlTree &&
                        e.urlHandlingStrategy.shouldProcessUrl(e.rawUrlTree)
                      ) {
                        const {
                            id: d,
                            extractedUrl: h,
                            source: f,
                            restoredState: p,
                            extras: m,
                          } = s,
                          y = new Lf(d, this.urlSerializer.serialize(h), f, p);
                        this.events.next(y);
                        const D = yw(h, e.rootComponentType).snapshot;
                        return R(
                          (r = {
                            ...s,
                            targetSnapshot: D,
                            urlAfterRedirects: h,
                            extras: {
                              ...m,
                              skipLocationChange: !1,
                              replaceUrl: !1,
                            },
                          })
                        );
                      }
                      return (e.rawUrlTree = s.rawUrl), s.resolve(null), Gr;
                    }),
                    We((s) => {
                      const a = new UH(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot
                      );
                      this.events.next(a);
                    }),
                    B(
                      (s) =>
                        (r = {
                          ...s,
                          guards: p2(
                            s.targetSnapshot,
                            s.currentSnapshot,
                            this.rootContexts
                          ),
                        })
                    ),
                    (function M2(n, t) {
                      return et((e) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: i,
                          guards: {
                            canActivateChecks: o,
                            canDeactivateChecks: s,
                          },
                        } = e;
                        return 0 === s.length && 0 === o.length
                          ? R({ ...e, guardsResult: !0 })
                          : (function S2(n, t, e, r) {
                              return Ue(n).pipe(
                                et((i) =>
                                  (function R2(n, t, e, r, i) {
                                    const o =
                                      t && t.routeConfig
                                        ? t.routeConfig.canDeactivate
                                        : null;
                                    return o && 0 !== o.length
                                      ? R(
                                          o.map((a) => {
                                            const l = Vs(t) ?? i,
                                              u = uo(a, l);
                                            return wr(
                                              (function D2(n) {
                                                return n && Us(n.canDeactivate);
                                              })(u)
                                                ? u.canDeactivate(n, t, e, r)
                                                : l.runInContext(() =>
                                                    u(n, t, e, r)
                                                  )
                                            ).pipe(Er());
                                          })
                                        ).pipe(co())
                                      : R(!0);
                                  })(i.component, i.route, e, t, r)
                                ),
                                Er((i) => !0 !== i, !0)
                              );
                            })(s, r, i, n).pipe(
                              et((a) =>
                                a &&
                                (function _2(n) {
                                  return "boolean" == typeof n;
                                })(a)
                                  ? (function A2(n, t, e, r) {
                                      return Ue(t).pipe(
                                        br((i) =>
                                          Xh(
                                            (function T2(n, t) {
                                              return (
                                                null !== n && t && t(new WH(n)),
                                                R(!0)
                                              );
                                            })(i.route.parent, r),
                                            (function I2(n, t) {
                                              return (
                                                null !== n && t && t(new QH(n)),
                                                R(!0)
                                              );
                                            })(i.route, r),
                                            (function x2(n, t, e) {
                                              const r = t[t.length - 1],
                                                o = t
                                                  .slice(0, t.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function m2(n) {
                                                      const t = n.routeConfig
                                                        ? n.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return t && 0 !== t.length
                                                        ? { node: n, guards: t }
                                                        : null;
                                                    })(s)
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    qE(() =>
                                                      R(
                                                        s.guards.map((l) => {
                                                          const u =
                                                              Vs(s.node) ?? e,
                                                            c = uo(l, u);
                                                          return wr(
                                                            (function C2(n) {
                                                              return (
                                                                n &&
                                                                Us(
                                                                  n.canActivateChild
                                                                )
                                                              );
                                                            })(c)
                                                              ? c.canActivateChild(
                                                                  r,
                                                                  n
                                                                )
                                                              : u.runInContext(
                                                                  () => c(r, n)
                                                                )
                                                          ).pipe(Er());
                                                        })
                                                      ).pipe(co())
                                                    )
                                                  );
                                              return R(o).pipe(co());
                                            })(n, i.path, e),
                                            (function F2(n, t, e) {
                                              const r = t.routeConfig
                                                ? t.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return R(!0);
                                              const i = r.map((o) =>
                                                qE(() => {
                                                  const s = Vs(t) ?? e,
                                                    a = uo(o, s);
                                                  return wr(
                                                    (function b2(n) {
                                                      return (
                                                        n && Us(n.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(t, n)
                                                      : s.runInContext(() =>
                                                          a(t, n)
                                                        )
                                                  ).pipe(Er());
                                                })
                                              );
                                              return R(i).pipe(co());
                                            })(n, i.route, e)
                                          )
                                        ),
                                        Er((i) => !0 !== i, !0)
                                      );
                                    })(r, o, n, t)
                                  : R(a)
                              ),
                              B((a) => ({ ...e, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (s) => this.events.next(s)),
                    We((s) => {
                      if (
                        ((r.guardsResult = s.guardsResult), Jr(s.guardsResult))
                      )
                        throw Cw(0, s.guardsResult);
                      const a = new jH(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot,
                        !!s.guardsResult
                      );
                      this.events.next(a);
                    }),
                    Qn(
                      (s) =>
                        !!s.guardsResult ||
                        (e.restoreHistory(s),
                        this.cancelNavigationTransition(s, "", 3, e),
                        !1)
                    ),
                    Yf((s) => {
                      if (s.guards.canActivateChecks.length)
                        return R(s).pipe(
                          We((a) => {
                            const l = new $H(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          }),
                          gn((a) => {
                            let l = !1;
                            return R(a).pipe(
                              (function J2(n, t) {
                                return et((e) => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: i },
                                  } = e;
                                  if (!i.length) return R(e);
                                  let o = 0;
                                  return Ue(i).pipe(
                                    br((s) =>
                                      (function eU(n, t, e, r) {
                                        const i = n.routeConfig,
                                          o = n._resolve;
                                        return (
                                          void 0 !== i?.title &&
                                            !Uw(i) &&
                                            (o[Ts] = i.title),
                                          (function tU(n, t, e, r) {
                                            const i = (function nU(n) {
                                              return [
                                                ...Object.keys(n),
                                                ...Object.getOwnPropertySymbols(
                                                  n
                                                ),
                                              ];
                                            })(n);
                                            if (0 === i.length) return R({});
                                            const o = {};
                                            return Ue(i).pipe(
                                              et((s) =>
                                                (function rU(n, t, e, r) {
                                                  const i = Vs(t) ?? r,
                                                    o = uo(n, i);
                                                  return wr(
                                                    o.resolve
                                                      ? o.resolve(t, e)
                                                      : i.runInContext(() =>
                                                          o(t, e)
                                                        )
                                                  );
                                                })(n[s], t, e, r).pipe(
                                                  Er(),
                                                  We((a) => {
                                                    o[s] = a;
                                                  })
                                                )
                                              ),
                                              Ff(1),
                                              (function cH(n) {
                                                return (t) => t.lift(new dH(n));
                                              })(o),
                                              vr((s) => (Wf(s) ? Gr : to(s)))
                                            );
                                          })(o, n, t, r).pipe(
                                            B(
                                              (s) => (
                                                (n._resolvedData = s),
                                                (n.data = _w(n, e).resolve),
                                                i &&
                                                  Uw(i) &&
                                                  (n.data[Ts] = i.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(s.route, r, n, t)
                                    ),
                                    We(() => o++),
                                    Ff(1),
                                    et((s) => (o === i.length ? R(e) : Gr))
                                  );
                                });
                              })(
                                e.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              We({
                                next: () => (l = !0),
                                complete: () => {
                                  l ||
                                    (e.restoreHistory(a),
                                    this.cancelNavigationTransition(
                                      a,
                                      "",
                                      2,
                                      e
                                    ));
                                },
                              })
                            );
                          }),
                          We((a) => {
                            const l = new zH(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          })
                        );
                    }),
                    Yf((s) => {
                      const a = (l) => {
                        const u = [];
                        l.routeConfig?.loadComponent &&
                          !l.routeConfig._loadedComponent &&
                          u.push(
                            this.configLoader.loadComponent(l.routeConfig).pipe(
                              We((c) => {
                                l.component = c;
                              }),
                              B(() => {})
                            )
                          );
                        for (const c of l.children) u.push(...a(c));
                        return u;
                      };
                      return GE(a(s.targetSnapshot.root)).pipe(uu(), fr(1));
                    }),
                    Yf(() => e.afterPreactivation()),
                    B((s) => {
                      const a = (function n2(n, t, e) {
                        const r = Ps(n, t._root, e ? e._root : void 0);
                        return new gw(r, t);
                      })(
                        e.routeReuseStrategy,
                        s.targetSnapshot,
                        s.currentRouterState
                      );
                      return (r = { ...s, targetRouterState: a });
                    }),
                    We((s) => {
                      (e.currentUrlTree = s.urlAfterRedirects),
                        (e.rawUrlTree = e.urlHandlingStrategy.merge(
                          s.urlAfterRedirects,
                          s.rawUrl
                        )),
                        (e.routerState = s.targetRouterState),
                        "deferred" === e.urlUpdateStrategy &&
                          (s.extras.skipLocationChange ||
                            e.setBrowserUrl(e.rawUrlTree, s),
                          (e.browserUrlTree = s.urlAfterRedirects));
                    }),
                    ((n, t, e) =>
                      B(
                        (r) => (
                          new f2(
                            t,
                            r.targetRouterState,
                            r.currentRouterState,
                            e
                          ).activate(n),
                          r
                        )
                      ))(this.rootContexts, e.routeReuseStrategy, (s) =>
                      this.events.next(s)
                    ),
                    We({
                      next: (s) => {
                        (i = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          (e.navigated = !0),
                          this.events.next(
                            new ei(
                              s.id,
                              this.urlSerializer.serialize(s.extractedUrl),
                              this.urlSerializer.serialize(e.currentUrlTree)
                            )
                          ),
                          e.titleStrategy?.updateTitle(
                            s.targetRouterState.snapshot
                          ),
                          s.resolve(!0);
                      },
                      complete: () => {
                        i = !0;
                      },
                    }),
                    nu(() => {
                      i || o || this.cancelNavigationTransition(r, "", 1, e),
                        this.currentNavigation?.id === r.id &&
                          (this.currentNavigation = null);
                    }),
                    vr((s) => {
                      if (((o = !0), ww(s))) {
                        Ew(s) || ((e.navigated = !0), e.restoreHistory(r, !0));
                        const a = new yu(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s.message,
                          s.cancellationCode
                        );
                        if ((this.events.next(a), Ew(s))) {
                          const l = e.urlHandlingStrategy.merge(
                              s.url,
                              e.rawUrlTree
                            ),
                            u = {
                              skipLocationChange: r.extras.skipLocationChange,
                              replaceUrl:
                                "eager" === e.urlUpdateStrategy || Gw(r.source),
                            };
                          e.scheduleNavigation(l, "imperative", null, u, {
                            resolve: r.resolve,
                            reject: r.reject,
                            promise: r.promise,
                          });
                        } else r.resolve(!1);
                      } else {
                        e.restoreHistory(r, !0);
                        const a = new fw(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s,
                          r.targetSnapshot ?? void 0
                        );
                        this.events.next(a);
                        try {
                          r.resolve(e.errorHandler(s));
                        } catch (l) {
                          r.reject(l);
                        }
                      }
                      return Gr;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(e, r, i, o) {
            const s = new yu(
              e.id,
              this.urlSerializer.serialize(e.extractedUrl),
              r,
              i
            );
            this.events.next(s), e.resolve(!1);
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      function Gw(n) {
        return "imperative" !== n;
      }
      let qw = (() => {
          class n {
            buildTitle(e) {
              let r,
                i = e.root;
              for (; void 0 !== i; )
                (r = this.getResolvedTitleForRoute(i) ?? r),
                  (i = i.children.find((o) => o.outlet === q));
              return r;
            }
            getResolvedTitleForRoute(e) {
              return e.data[Ts];
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = I({
              token: n,
              factory: function () {
                return Y(sU);
              },
              providedIn: "root",
            })),
            n
          );
        })(),
        sU = (() => {
          class n extends qw {
            constructor(e) {
              super(), (this.title = e);
            }
            updateTitle(e) {
              const r = this.buildTitle(e);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)(v(gC));
            }),
            (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })(),
        aU = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = I({
              token: n,
              factory: function () {
                return Y(uU);
              },
              providedIn: "root",
            })),
            n
          );
        })();
      class lU {
        shouldDetach(t) {
          return !1;
        }
        store(t, e) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, e) {
          return t.routeConfig === e.routeConfig;
        }
      }
      let uU = (() => {
        class n extends lU {}
        return (
          (n.ɵfac = (function () {
            let t;
            return function (r) {
              return (t || (t = je(n)))(r || n);
            };
          })()),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const Su = new w("", { providedIn: "root", factory: () => ({}) });
      let dU = (() => {
          class n {}
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = I({
              token: n,
              factory: function () {
                return Y(hU);
              },
              providedIn: "root",
            })),
            n
          );
        })(),
        hU = (() => {
          class n {
            shouldProcessUrl(e) {
              return !0;
            }
            extract(e) {
              return e;
            }
            merge(e, r) {
              return e;
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
            n
          );
        })();
      function fU(n) {
        throw n;
      }
      function pU(n, t, e) {
        return t.parse("/");
      }
      const mU = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        gU = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let Ot = (() => {
        class n {
          constructor() {
            (this.disposed = !1),
              (this.currentPageId = 0),
              (this.console = Y(YR)),
              (this.isNgZoneEnabled = !1),
              (this.options = Y(Su, { optional: !0 }) || {}),
              (this.errorHandler = this.options.errorHandler || fU),
              (this.malformedUriErrorHandler =
                this.options.malformedUriErrorHandler || pU),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.afterPreactivation = () => R(void 0)),
              (this.urlHandlingStrategy = Y(dU)),
              (this.routeReuseStrategy = Y(aU)),
              (this.urlCreationStrategy = Y(JH)),
              (this.titleStrategy = Y(qw)),
              (this.onSameUrlNavigation =
                this.options.onSameUrlNavigation || "ignore"),
              (this.paramsInheritanceStrategy =
                this.options.paramsInheritanceStrategy || "emptyOnly"),
              (this.urlUpdateStrategy =
                this.options.urlUpdateStrategy || "deferred"),
              (this.canceledNavigationResolution =
                this.options.canceledNavigationResolution || "replace"),
              (this.config = ZE(Y(ho, { optional: !0 }) ?? [])),
              (this.navigationTransitions = Y(Xf)),
              (this.urlSerializer = Y(xs)),
              (this.location = Y(_h)),
              (this.rootComponentType = null),
              (this.isNgZoneEnabled = Y(K) instanceof K && K.isInAngularZone()),
              this.resetConfig(this.config),
              (this.currentUrlTree = new Zr()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = yw(
                this.currentUrlTree,
                this.rootComponentType
              )),
              this.navigationTransitions.setupNavigations(this).subscribe(
                (e) => {
                  (this.lastSuccessfulId = e.id),
                    (this.currentPageId = e.targetPageId);
                },
                (e) => {
                  this.console.warn(`Unhandled Navigation Error: ${e}`);
                }
              );
          }
          get navigationId() {
            return this.navigationTransitions.navigationId;
          }
          get browserPageId() {
            return this.location.getState()?.ɵrouterPageId;
          }
          get events() {
            return this.navigationTransitions.events;
          }
          resetRootComponentType(e) {
            (this.rootComponentType = e),
              (this.routerState.root.component = this.rootComponentType);
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              this.navigationTransitions.hasRequestedNavigation ||
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((e) => {
                const r = "popstate" === e.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    const i = { replaceUrl: !0 },
                      o = e.state?.navigationId ? e.state : null;
                    if (e.state) {
                      const a = { ...e.state };
                      delete a.navigationId,
                        delete a.ɵrouterPageId,
                        0 !== Object.keys(a).length && (i.state = a);
                    }
                    const s = this.parseUrl(e.url);
                    this.scheduleNavigation(s, r, o, i);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.navigationTransitions.currentNavigation;
          }
          resetConfig(e) {
            (this.config = e.map(qf)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.navigationTransitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(e, r = {}) {
            const {
                relativeTo: i,
                queryParams: o,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: l,
              } = r,
              u = l ? this.currentUrlTree.fragment : s;
            let c = null;
            switch (a) {
              case "merge":
                c = { ...this.currentUrlTree.queryParams, ...o };
                break;
              case "preserve":
                c = this.currentUrlTree.queryParams;
                break;
              default:
                c = o || null;
            }
            return (
              null !== c && (c = this.removeEmptyProps(c)),
              this.urlCreationStrategy.createUrlTree(
                i,
                this.routerState,
                this.currentUrlTree,
                e,
                c,
                u ?? null
              )
            );
          }
          navigateByUrl(e, r = { skipLocationChange: !1 }) {
            const i = Jr(e) ? e : this.parseUrl(e),
              o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
            return this.scheduleNavigation(o, "imperative", null, r);
          }
          navigate(e, r = { skipLocationChange: !1 }) {
            return (
              (function yU(n) {
                for (let t = 0; t < n.length; t++) {
                  if (null == n[t]) throw new b(4008, !1);
                }
              })(e),
              this.navigateByUrl(this.createUrlTree(e, r), r)
            );
          }
          serializeUrl(e) {
            return this.urlSerializer.serialize(e);
          }
          parseUrl(e) {
            let r;
            try {
              r = this.urlSerializer.parse(e);
            } catch (i) {
              r = this.malformedUriErrorHandler(i, this.urlSerializer, e);
            }
            return r;
          }
          isActive(e, r) {
            let i;
            if (((i = !0 === r ? { ...mU } : !1 === r ? { ...gU } : r), Jr(e)))
              return ew(this.currentUrlTree, e, i);
            const o = this.parseUrl(e);
            return ew(this.currentUrlTree, o, i);
          }
          removeEmptyProps(e) {
            return Object.keys(e).reduce((r, i) => {
              const o = e[i];
              return null != o && (r[i] = o), r;
            }, {});
          }
          scheduleNavigation(e, r, i, o, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, l, u, c;
            return (
              s
                ? ((a = s.resolve), (l = s.reject), (u = s.promise))
                : (u = new Promise((d, h) => {
                    (a = d), (l = h);
                  })),
              "computed" === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (i = this.location.getState()),
                  (c =
                    i && i.ɵrouterPageId
                      ? i.ɵrouterPageId
                      : o.replaceUrl || o.skipLocationChange
                      ? this.browserPageId ?? 0
                      : (this.browserPageId ?? 0) + 1))
                : (c = 0),
              this.navigationTransitions.handleNavigationRequest({
                targetPageId: c,
                source: r,
                restoredState: i,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                rawUrl: e,
                extras: o,
                resolve: a,
                reject: l,
                promise: u,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              u.catch((d) => Promise.reject(d))
            );
          }
          setBrowserUrl(e, r) {
            const i = this.urlSerializer.serialize(e),
              o = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, r.targetPageId),
              };
            this.location.isCurrentPathEqualTo(i) || r.extras.replaceUrl
              ? this.location.replaceState(i, "", o)
              : this.location.go(i, "", o);
          }
          restoreHistory(e, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const i = this.currentPageId - e.targetPageId;
              ("popstate" !== e.source &&
                "eager" !== this.urlUpdateStrategy &&
                this.currentUrlTree !==
                  this.getCurrentNavigation()?.finalUrl) ||
              0 === i
                ? this.currentUrlTree ===
                    this.getCurrentNavigation()?.finalUrl &&
                  0 === i &&
                  (this.resetState(e),
                  (this.browserUrlTree = e.currentUrlTree),
                  this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(i);
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(e), this.resetUrlToCurrentUrlTree());
          }
          resetState(e) {
            (this.routerState = e.currentRouterState),
              (this.currentUrlTree = e.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                e.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          generateNgRouterState(e, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: e, ɵrouterPageId: r }
              : { navigationId: e };
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      class Kw {}
      let bU = (() => {
        class n {
          constructor(e, r, i, o, s) {
            (this.router = e),
              (this.injector = i),
              (this.preloadingStrategy = o),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                Qn((e) => e instanceof ei),
                br(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(e, r) {
            const i = [];
            for (const o of r) {
              o.providers &&
                !o._injector &&
                (o._injector = il(o.providers, e, `Route: ${o.path}`));
              const s = o._injector ?? e,
                a = o._loadedInjector ?? s;
              (o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) ||
              (o.loadComponent && !o._loadedComponent)
                ? i.push(this.preloadConfig(s, o))
                : (o.children || o._loadedRoutes) &&
                  i.push(this.processRoutes(a, o.children ?? o._loadedRoutes));
            }
            return Ue(i).pipe(ui());
          }
          preloadConfig(e, r) {
            return this.preloadingStrategy.preload(r, () => {
              let i;
              i =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(e, r)
                  : R(null);
              const o = i.pipe(
                et((s) =>
                  null === s
                    ? R(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? e, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? Ue([o, this.loader.loadComponent(r)]).pipe(ui())
                : o;
            });
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(Ot), v(Jv), v(Bn), v(Kw), v(Zf));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac, providedIn: "root" })),
          n
        );
      })();
      const ep = new w("");
      let Qw = (() => {
        class n {
          constructor(e, r, i, o, s = {}) {
            (this.urlSerializer = e),
              (this.transitions = r),
              (this.viewportScroller = i),
              (this.zone = o),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((e) => {
              e instanceof Lf
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = e.navigationTrigger),
                  (this.restoredId = e.restoredState
                    ? e.restoredState.navigationId
                    : 0))
                : e instanceof ei &&
                  ((this.lastId = e.id),
                  this.scheduleScrollEvent(
                    e,
                    this.urlSerializer.parse(e.urlAfterRedirects).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((e) => {
              e instanceof pw &&
                (e.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(e.position)
                  : e.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(e.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(e, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new pw(
                      e,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
        }
        return (
          (n.ɵfac = function (e) {
            !(function cy() {
              throw new Error("invalid");
            })();
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      function po(n, t) {
        return { ɵkind: n, ɵproviders: t };
      }
      function Zw() {
        const n = Y(zt);
        return (t) => {
          const e = n.get(hs);
          if (t !== e.components[0]) return;
          const r = n.get(Ot),
            i = n.get(Xw);
          1 === n.get(np) && r.initialNavigation(),
            n.get(Jw, null, P.Optional)?.setUpPreloading(),
            n.get(ep, null, P.Optional)?.init(),
            r.resetRootComponentType(e.componentTypes[0]),
            i.closed || (i.next(), i.unsubscribe());
        };
      }
      const Xw = new w("", { factory: () => new He() }),
        np = new w("", { providedIn: "root", factory: () => 1 });
      const Jw = new w("");
      function MU(n) {
        return po(0, [
          { provide: Jw, useExisting: bU },
          { provide: Kw, useExisting: n },
        ]);
      }
      const eM = new w("ROUTER_FORROOT_GUARD"),
        SU = [
          _h,
          { provide: xs, useClass: xf },
          Ot,
          Ls,
          {
            provide: lo,
            useFactory: function Yw(n) {
              return n.routerState.root;
            },
            deps: [Ot],
          },
          Zf,
          [],
        ];
      function AU() {
        return new sb("Router", Ot);
      }
      let tM = (() => {
        class n {
          constructor(e) {}
          static forRoot(e, r) {
            return {
              ngModule: n,
              providers: [
                SU,
                [],
                { provide: ho, multi: !0, useValue: e },
                {
                  provide: eM,
                  useFactory: xU,
                  deps: [[Ot, new ar(), new Si()]],
                },
                { provide: Su, useValue: r || {} },
                r?.useHash
                  ? { provide: zr, useClass: VN }
                  : { provide: zr, useClass: Tb },
                {
                  provide: ep,
                  useFactory: () => {
                    const n = Y(aO),
                      t = Y(K),
                      e = Y(Su),
                      r = Y(Xf),
                      i = Y(xs);
                    return (
                      e.scrollOffset && n.setOffset(e.scrollOffset),
                      new Qw(i, r, n, t, e)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? MU(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: sb, multi: !0, useFactory: AU },
                r?.initialNavigation ? RU(r) : [],
                [
                  { provide: nM, useFactory: Zw },
                  { provide: Xv, multi: !0, useExisting: nM },
                ],
              ],
            };
          }
          static forChild(e) {
            return {
              ngModule: n,
              providers: [{ provide: ho, multi: !0, useValue: e }],
            };
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(eM, 8));
          }),
          (n.ɵmod = me({ type: n })),
          (n.ɵinj = de({ imports: [zf] })),
          n
        );
      })();
      function xU(n) {
        return "guarded";
      }
      function RU(n) {
        return [
          "disabled" === n.initialNavigation
            ? po(3, [
                {
                  provide: ll,
                  multi: !0,
                  useFactory: () => {
                    const t = Y(Ot);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: np, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === n.initialNavigation
            ? po(2, [
                { provide: np, useValue: 0 },
                {
                  provide: ll,
                  multi: !0,
                  deps: [zt],
                  useFactory: (t) => {
                    const e = t.get(PN, Promise.resolve());
                    return () =>
                      e.then(
                        () =>
                          new Promise((i) => {
                            const o = t.get(Ot),
                              s = t.get(Xw);
                            (function r(i) {
                              t.get(Ot)
                                .events.pipe(
                                  Qn(
                                    (s) =>
                                      s instanceof ei ||
                                      s instanceof yu ||
                                      s instanceof fw
                                  ),
                                  B(
                                    (s) =>
                                      s instanceof ei ||
                                      (s instanceof yu &&
                                        (0 === s.code || 1 === s.code) &&
                                        null)
                                  ),
                                  Qn((s) => null !== s),
                                  fr(1)
                                )
                                .subscribe(() => {
                                  i();
                                });
                            })(() => {
                              i(!0);
                            }),
                              (o.afterPreactivation = () => (
                                i(!0), s.closed ? R(void 0) : s
                              )),
                              o.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const nM = new w("");
      class mo {}
      (mo.ɵfac = function (t) {
        return new (t || mo)();
      }),
        (mo.ɵmod = me({ type: mo })),
        (mo.ɵinj = de({ imports: [tM.forRoot([]), tM] }));
      class go {
        constructor() {}
        searchStockByStockSymbol(t) {
          this.addStockSymbolToLocalStorage(t), console.log("service", t);
        }
        addStockSymbolToLocalStorage(t) {
          localStorage.setItem("stockSymbol", t);
        }
      }
      function OU(n, t) {
        if ((1 & n && (re(0, "mat-error"), cn(1), ie()), 2 & n)) {
          const e = an();
          _e(1), Hr(e.getErrorMessage());
        }
      }
      (go.ɵfac = function (t) {
        return new (t || go)();
      }),
        (go.ɵprov = I({ token: go, factory: go.ɵfac, providedIn: "root" }));
      class zs {
        constructor() {
          (this.onStockSymbolFormControlChange = new pe()),
            (this.stockSymbolFormControl = new eu(void 0, [
              rf.required,
              rf.minLength(1),
              rf.maxLength(5),
            ]));
        }
        getErrorMessage() {
          return null != this.stockSymbolFormControl.errors
            ? (this.onStockSymbolFormControlChange.emit(
                this.stockSymbolFormControl
              ),
              "Please enter a stock symbol that is between 1 to 5 letters")
            : "";
        }
      }
      (zs.ɵfac = function (t) {
        return new (t || zs)();
      }),
        (zs.ɵcmp = Qe({
          type: zs,
          selectors: [["st-stock-form-field"]],
          outputs: {
            onStockSymbolFormControlChange: "onStockSymbolFormControlChange",
          },
          decls: 5,
          vars: 2,
          consts: [
            [
              "id",
              "stockInput",
              "type",
              "text",
              "matInput",
              "",
              3,
              "formControl",
            ],
            [4, "ngIf"],
          ],
          template: function (t, e) {
            1 & t &&
              (re(0, "mat-form-field")(1, "mat-label"),
              cn(2, "Enter stock symbol"),
              ie(),
              kt(3, "input", 0),
              mt(4, OU, 2, 1, "mat-error", 1),
              ie()),
              2 & t &&
                (_e(3),
                ge("formControl", e.stockSymbolFormControl),
                _e(1),
                ge("ngIf", e.stockSymbolFormControl.invalid));
          },
          dependencies: [Ml, BL, qL, tf, JV, jl, GD, bf],
        }));
      class Gs {
        constructor() {
          (this.isInValidStockSymbol = !0), (this.myClick = new pe());
        }
        ngOnInit() {}
        saveStockSymbolToLocalStorage() {
          this.myClick.emit();
        }
      }
      (Gs.ɵfac = function (t) {
        return new (t || Gs)();
      }),
        (Gs.ɵcmp = Qe({
          type: Gs,
          selectors: [["st-stock-track-button"]],
          inputs: { isInValidStockSymbol: "isInValidStockSymbol" },
          outputs: { myClick: "myClick" },
          decls: 2,
          vars: 1,
          consts: [
            ["id", "trackBtn", "mat-raised-button", "", 3, "disabled", "click"],
          ],
          template: function (t, e) {
            1 & t &&
              (re(0, "button", 0),
              ke("click", function () {
                return e.saveStockSymbolToLocalStorage();
              }),
              cn(1, " Track Stock\n"),
              ie()),
              2 & t && ge("disabled", e.isInValidStockSymbol);
          },
          dependencies: [$E],
        }));
      class qs {
        constructor(t) {
          (this.stockService = t),
            (this.title = "stock tracker"),
            (this.subtitle =
              "Enter the symbol of a stock to track (i.e. APPL, TSLA, GOOGL)"),
            (this.stockSymbolForm = new eu(void 0));
        }
        receiveFormControl(t) {
          this.stockSymbolForm = t;
        }
      }
      (qs.ɵfac = function (t) {
        return new (t || qs)(g(go));
      }),
        (qs.ɵcmp = Qe({
          type: qs,
          selectors: [["st-stock-enter-card"]],
          decls: 9,
          vars: 5,
          consts: [
            [3, "onStockSymbolFormControlChange"],
            [3, "isInValidStockSymbol", "myClick"],
          ],
          template: function (t, e) {
            1 & t &&
              (re(0, "mat-card")(1, "mat-card-title-group")(
                2,
                "mat-card-title"
              ),
              cn(3),
              (function Dv(n, t) {
                const e = ee();
                let r;
                const i = n + 22;
                e.firstCreatePass
                  ? ((r = (function hR(n, t) {
                      if (t)
                        for (let e = t.length - 1; e >= 0; e--) {
                          const r = t[e];
                          if (n === r.name) return r;
                        }
                    })(t, e.pipeRegistry)),
                    (e.data[i] = r),
                    r.onDestroy &&
                      (e.destroyHooks || (e.destroyHooks = [])).push(
                        i,
                        r.onDestroy
                      ))
                  : (r = e.data[i]);
                const o = r.factory || (r.factory = Tr(r.type)),
                  s = Ut(g);
                try {
                  const a = Ma(!1),
                    l = o();
                  return (
                    Ma(a),
                    (function eF(n, t, e, r) {
                      e >= n.data.length &&
                        ((n.data[e] = null), (n.blueprint[e] = null)),
                        (t[e] = r);
                    })(e, C(), i, l),
                    l
                  );
                } finally {
                  Ut(s);
                }
              })(4, "uppercase"),
              ie(),
              re(5, "mat-card-subtitle"),
              cn(6),
              ie()(),
              re(7, "st-stock-form-field", 0),
              ke("onStockSymbolFormControlChange", function (i) {
                return e.receiveFormControl(i);
              }),
              ie(),
              re(8, "st-stock-track-button", 1),
              ke("myClick", function () {
                return e.stockService.searchStockByStockSymbol(
                  e.stockSymbolForm.value
                );
              }),
              ie()()),
              2 & t &&
                (_e(3),
                Hr(Ev(4, 3, e.title)),
                _e(3),
                Hr(e.subtitle),
                _e(2),
                ge(
                  "isInValidStockSymbol",
                  null == e.stockSymbolForm.value || e.stockSymbolForm.invalid
                ));
          },
          dependencies: [nL, rL, eL, tL, zs, Gs, Gb],
          changeDetection: 0,
        }));
      class Ws {
        constructor() {
          this.title = "stock-tracker";
        }
      }
      function rM(n) {
        return new b(3e3, !1);
      }
      function gj() {
        return typeof window < "u" && typeof window.document < "u";
      }
      function rp() {
        return (
          typeof process < "u" &&
          "[object process]" === {}.toString.call(process)
        );
      }
      function Mr(n) {
        switch (n.length) {
          case 0:
            return new Es();
          case 1:
            return n[0];
          default:
            return new dD(n);
        }
      }
      function iM(n, t, e, r, i = new Map(), o = new Map()) {
        const s = [],
          a = [];
        let l = -1,
          u = null;
        if (
          (r.forEach((c) => {
            const d = c.get("offset"),
              h = d == l,
              f = (h && u) || new Map();
            c.forEach((p, m) => {
              let y = m,
                D = p;
              if ("offset" !== m)
                switch (((y = t.normalizePropertyName(y, s)), D)) {
                  case "!":
                    D = i.get(m);
                    break;
                  case Wn:
                    D = o.get(m);
                    break;
                  default:
                    D = t.normalizeStyleValue(m, y, D, s);
                }
              f.set(y, D);
            }),
              h || a.push(f),
              (u = f),
              (l = d);
          }),
          s.length)
        )
          throw (function ij(n) {
            return new b(3502, !1);
          })();
        return a;
      }
      function ip(n, t, e, r) {
        switch (t) {
          case "start":
            n.onStart(() => r(e && op(e, "start", n)));
            break;
          case "done":
            n.onDone(() => r(e && op(e, "done", n)));
            break;
          case "destroy":
            n.onDestroy(() => r(e && op(e, "destroy", n)));
        }
      }
      function op(n, t, e) {
        const o = sp(
            n.element,
            n.triggerName,
            n.fromState,
            n.toState,
            t || n.phaseName,
            e.totalTime ?? n.totalTime,
            !!e.disabled
          ),
          s = n._data;
        return null != s && (o._data = s), o;
      }
      function sp(n, t, e, r, i = "", o = 0, s) {
        return {
          element: n,
          triggerName: t,
          fromState: e,
          toState: r,
          phaseName: i,
          totalTime: o,
          disabled: !!s,
        };
      }
      function Pt(n, t, e) {
        let r = n.get(t);
        return r || n.set(t, (r = e)), r;
      }
      function oM(n) {
        const t = n.indexOf(":");
        return [n.substring(1, t), n.slice(t + 1)];
      }
      (Ws.ɵfac = function (t) {
        return new (t || Ws)();
      }),
        (Ws.ɵcmp = Qe({
          type: Ws,
          selectors: [["st-root"]],
          decls: 1,
          vars: 0,
          template: function (t, e) {
            1 & t && kt(0, "st-stock-enter-card");
          },
          dependencies: [qs],
        }));
      let ap = (n, t) => !1,
        sM = (n, t, e) => [],
        aM = null;
      function lp(n) {
        const t = n.parentNode || n.host;
        return t === aM ? null : t;
      }
      (rp() || typeof Element < "u") &&
        (gj()
          ? ((aM = (() => document.documentElement)()),
            (ap = (n, t) => {
              for (; t; ) {
                if (t === n) return !0;
                t = lp(t);
              }
              return !1;
            }))
          : (ap = (n, t) => n.contains(t)),
        (sM = (n, t, e) => {
          if (e) return Array.from(n.querySelectorAll(t));
          const r = n.querySelector(t);
          return r ? [r] : [];
        }));
      let ti = null,
        lM = !1;
      const uM = ap,
        cM = sM;
      let dM = (() => {
          class n {
            validateStyleProperty(e) {
              return (function _j(n) {
                ti ||
                  ((ti =
                    (function vj() {
                      return typeof document < "u" ? document.body : null;
                    })() || {}),
                  (lM = !!ti.style && "WebkitAppearance" in ti.style));
                let t = !0;
                return (
                  ti.style &&
                    !(function yj(n) {
                      return "ebkit" == n.substring(1, 6);
                    })(n) &&
                    ((t = n in ti.style),
                    !t &&
                      lM &&
                      (t =
                        "Webkit" + n.charAt(0).toUpperCase() + n.slice(1) in
                        ti.style)),
                  t
                );
              })(e);
            }
            matchesElement(e, r) {
              return !1;
            }
            containsElement(e, r) {
              return uM(e, r);
            }
            getParentElement(e) {
              return lp(e);
            }
            query(e, r, i) {
              return cM(e, r, i);
            }
            computeStyle(e, r, i) {
              return i || "";
            }
            animate(e, r, i, o, s, a = [], l) {
              return new Es(i, o);
            }
          }
          return (
            (n.ɵfac = function (e) {
              return new (e || n)();
            }),
            (n.ɵprov = I({ token: n, factory: n.ɵfac })),
            n
          );
        })(),
        up = (() => {
          class n {}
          return (n.NOOP = new dM()), n;
        })();
      const cp = "ng-enter",
        Au = "ng-leave",
        Iu = "ng-trigger",
        Tu = ".ng-trigger",
        fM = "ng-animating",
        dp = ".ng-animating";
      function Xn(n) {
        if ("number" == typeof n) return n;
        const t = n.match(/^(-?[\.\d]+)(m?s)/);
        return !t || t.length < 2 ? 0 : hp(parseFloat(t[1]), t[2]);
      }
      function hp(n, t) {
        return "s" === t ? 1e3 * n : n;
      }
      function Fu(n, t, e) {
        return n.hasOwnProperty("duration")
          ? n
          : (function Dj(n, t, e) {
              let i,
                o = 0,
                s = "";
              if ("string" == typeof n) {
                const a = n.match(
                  /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i
                );
                if (null === a)
                  return t.push(rM()), { duration: 0, delay: 0, easing: "" };
                i = hp(parseFloat(a[1]), a[2]);
                const l = a[3];
                null != l && (o = hp(parseFloat(l), a[4]));
                const u = a[5];
                u && (s = u);
              } else i = n;
              if (!e) {
                let a = !1,
                  l = t.length;
                i < 0 &&
                  (t.push(
                    (function PU() {
                      return new b(3100, !1);
                    })()
                  ),
                  (a = !0)),
                  o < 0 &&
                    (t.push(
                      (function LU() {
                        return new b(3101, !1);
                      })()
                    ),
                    (a = !0)),
                  a && t.splice(l, 0, rM());
              }
              return { duration: i, delay: o, easing: s };
            })(n, t, e);
      }
      function Ks(n, t = {}) {
        return (
          Object.keys(n).forEach((e) => {
            t[e] = n[e];
          }),
          t
        );
      }
      function pM(n) {
        const t = new Map();
        return (
          Object.keys(n).forEach((e) => {
            t.set(e, n[e]);
          }),
          t
        );
      }
      function Sr(n, t = new Map(), e) {
        if (e) for (let [r, i] of e) t.set(r, i);
        for (let [r, i] of n) t.set(r, i);
        return t;
      }
      function gM(n, t, e) {
        return e ? t + ":" + e + ";" : "";
      }
      function yM(n) {
        let t = "";
        for (let e = 0; e < n.style.length; e++) {
          const r = n.style.item(e);
          t += gM(0, r, n.style.getPropertyValue(r));
        }
        for (const e in n.style)
          n.style.hasOwnProperty(e) &&
            !e.startsWith("_") &&
            (t += gM(0, Sj(e), n.style[e]));
        n.setAttribute("style", t);
      }
      function xn(n, t, e) {
        n.style &&
          (t.forEach((r, i) => {
            const o = pp(i);
            e && !e.has(i) && e.set(i, n.style[o]), (n.style[o] = r);
          }),
          rp() && yM(n));
      }
      function ni(n, t) {
        n.style &&
          (t.forEach((e, r) => {
            const i = pp(r);
            n.style[i] = "";
          }),
          rp() && yM(n));
      }
      function Qs(n) {
        return Array.isArray(n) ? (1 == n.length ? n[0] : uD(n)) : n;
      }
      const fp = new RegExp("{{\\s*(.+?)\\s*}}", "g");
      function _M(n) {
        let t = [];
        if ("string" == typeof n) {
          let e;
          for (; (e = fp.exec(n)); ) t.push(e[1]);
          fp.lastIndex = 0;
        }
        return t;
      }
      function Ys(n, t, e) {
        const r = n.toString(),
          i = r.replace(fp, (o, s) => {
            let a = t[s];
            return (
              null == a &&
                (e.push(
                  (function BU(n) {
                    return new b(3003, !1);
                  })()
                ),
                (a = "")),
              a.toString()
            );
          });
        return i == r ? n : i;
      }
      function xu(n) {
        const t = [];
        let e = n.next();
        for (; !e.done; ) t.push(e.value), (e = n.next());
        return t;
      }
      const Mj = /-+([a-z0-9])/g;
      function pp(n) {
        return n.replace(Mj, (...t) => t[1].toUpperCase());
      }
      function Sj(n) {
        return n.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      }
      function Lt(n, t, e) {
        switch (t.type) {
          case 7:
            return n.visitTrigger(t, e);
          case 0:
            return n.visitState(t, e);
          case 1:
            return n.visitTransition(t, e);
          case 2:
            return n.visitSequence(t, e);
          case 3:
            return n.visitGroup(t, e);
          case 4:
            return n.visitAnimate(t, e);
          case 5:
            return n.visitKeyframes(t, e);
          case 6:
            return n.visitStyle(t, e);
          case 8:
            return n.visitReference(t, e);
          case 9:
            return n.visitAnimateChild(t, e);
          case 10:
            return n.visitAnimateRef(t, e);
          case 11:
            return n.visitQuery(t, e);
          case 12:
            return n.visitStagger(t, e);
          default:
            throw (function HU(n) {
              return new b(3004, !1);
            })();
        }
      }
      function vM(n, t) {
        return window.getComputedStyle(n)[t];
      }
      function Rj(n, t) {
        const e = [];
        return (
          "string" == typeof n
            ? n.split(/\s*,\s*/).forEach((r) =>
                (function Nj(n, t, e) {
                  if (":" == n[0]) {
                    const l = (function kj(n, t) {
                      switch (n) {
                        case ":enter":
                          return "void => *";
                        case ":leave":
                          return "* => void";
                        case ":increment":
                          return (e, r) => parseFloat(r) > parseFloat(e);
                        case ":decrement":
                          return (e, r) => parseFloat(r) < parseFloat(e);
                        default:
                          return (
                            t.push(
                              (function ej(n) {
                                return new b(3016, !1);
                              })()
                            ),
                            "* => *"
                          );
                      }
                    })(n, e);
                    if ("function" == typeof l) return void t.push(l);
                    n = l;
                  }
                  const r = n.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
                  if (null == r || r.length < 4)
                    return (
                      e.push(
                        (function JU(n) {
                          return new b(3015, !1);
                        })()
                      ),
                      t
                    );
                  const i = r[1],
                    o = r[2],
                    s = r[3];
                  t.push(bM(i, s));
                  "<" == o[0] && !("*" == i && "*" == s) && t.push(bM(s, i));
                })(r, e, t)
              )
            : e.push(n),
          e
        );
      }
      const Ou = new Set(["true", "1"]),
        Pu = new Set(["false", "0"]);
      function bM(n, t) {
        const e = Ou.has(n) || Pu.has(n),
          r = Ou.has(t) || Pu.has(t);
        return (i, o) => {
          let s = "*" == n || n == i,
            a = "*" == t || t == o;
          return (
            !s && e && "boolean" == typeof i && (s = i ? Ou.has(n) : Pu.has(n)),
            !a && r && "boolean" == typeof o && (a = o ? Ou.has(t) : Pu.has(t)),
            s && a
          );
        };
      }
      const Oj = new RegExp("s*:selfs*,?", "g");
      function mp(n, t, e, r) {
        return new Pj(n).build(t, e, r);
      }
      class Pj {
        constructor(t) {
          this._driver = t;
        }
        build(t, e, r) {
          const i = new Bj(e);
          return this._resetContextStyleTimingState(i), Lt(this, Qs(t), i);
        }
        _resetContextStyleTimingState(t) {
          (t.currentQuerySelector = ""),
            (t.collectedStyles = new Map()),
            t.collectedStyles.set("", new Map()),
            (t.currentTime = 0);
        }
        visitTrigger(t, e) {
          let r = (e.queryCount = 0),
            i = (e.depCount = 0);
          const o = [],
            s = [];
          return (
            "@" == t.name.charAt(0) &&
              e.errors.push(
                (function jU() {
                  return new b(3006, !1);
                })()
              ),
            t.definitions.forEach((a) => {
              if ((this._resetContextStyleTimingState(e), 0 == a.type)) {
                const l = a,
                  u = l.name;
                u
                  .toString()
                  .split(/\s*,\s*/)
                  .forEach((c) => {
                    (l.name = c), o.push(this.visitState(l, e));
                  }),
                  (l.name = u);
              } else if (1 == a.type) {
                const l = this.visitTransition(a, e);
                (r += l.queryCount), (i += l.depCount), s.push(l);
              } else
                e.errors.push(
                  (function $U() {
                    return new b(3007, !1);
                  })()
                );
            }),
            {
              type: 7,
              name: t.name,
              states: o,
              transitions: s,
              queryCount: r,
              depCount: i,
              options: null,
            }
          );
        }
        visitState(t, e) {
          const r = this.visitStyle(t.styles, e),
            i = (t.options && t.options.params) || null;
          if (r.containsDynamicStyles) {
            const o = new Set(),
              s = i || {};
            r.styles.forEach((a) => {
              a instanceof Map &&
                a.forEach((l) => {
                  _M(l).forEach((u) => {
                    s.hasOwnProperty(u) || o.add(u);
                  });
                });
            }),
              o.size &&
                (xu(o.values()),
                e.errors.push(
                  (function zU(n, t) {
                    return new b(3008, !1);
                  })()
                ));
          }
          return {
            type: 0,
            name: t.name,
            style: r,
            options: i ? { params: i } : null,
          };
        }
        visitTransition(t, e) {
          (e.queryCount = 0), (e.depCount = 0);
          const r = Lt(this, Qs(t.animation), e);
          return {
            type: 1,
            matchers: Rj(t.expr, e.errors),
            animation: r,
            queryCount: e.queryCount,
            depCount: e.depCount,
            options: ri(t.options),
          };
        }
        visitSequence(t, e) {
          return {
            type: 2,
            steps: t.steps.map((r) => Lt(this, r, e)),
            options: ri(t.options),
          };
        }
        visitGroup(t, e) {
          const r = e.currentTime;
          let i = 0;
          const o = t.steps.map((s) => {
            e.currentTime = r;
            const a = Lt(this, s, e);
            return (i = Math.max(i, e.currentTime)), a;
          });
          return (
            (e.currentTime = i), { type: 3, steps: o, options: ri(t.options) }
          );
        }
        visitAnimate(t, e) {
          const r = (function Uj(n, t) {
            if (n.hasOwnProperty("duration")) return n;
            if ("number" == typeof n) return gp(Fu(n, t).duration, 0, "");
            const e = n;
            if (
              e
                .split(/\s+/)
                .some((o) => "{" == o.charAt(0) && "{" == o.charAt(1))
            ) {
              const o = gp(0, 0, "");
              return (o.dynamic = !0), (o.strValue = e), o;
            }
            const i = Fu(e, t);
            return gp(i.duration, i.delay, i.easing);
          })(t.timings, e.errors);
          e.currentAnimateTimings = r;
          let i,
            o = t.styles ? t.styles : Hl({});
          if (5 == o.type) i = this.visitKeyframes(o, e);
          else {
            let s = t.styles,
              a = !1;
            if (!s) {
              a = !0;
              const u = {};
              r.easing && (u.easing = r.easing), (s = Hl(u));
            }
            e.currentTime += r.duration + r.delay;
            const l = this.visitStyle(s, e);
            (l.isEmptyStep = a), (i = l);
          }
          return (
            (e.currentAnimateTimings = null),
            { type: 4, timings: r, style: i, options: null }
          );
        }
        visitStyle(t, e) {
          const r = this._makeStyleAst(t, e);
          return this._validateStyleAst(r, e), r;
        }
        _makeStyleAst(t, e) {
          const r = [],
            i = Array.isArray(t.styles) ? t.styles : [t.styles];
          for (let a of i)
            "string" == typeof a
              ? a === Wn
                ? r.push(a)
                : e.errors.push(new b(3002, !1))
              : r.push(pM(a));
          let o = !1,
            s = null;
          return (
            r.forEach((a) => {
              if (
                a instanceof Map &&
                (a.has("easing") && ((s = a.get("easing")), a.delete("easing")),
                !o)
              )
                for (let l of a.values())
                  if (l.toString().indexOf("{{") >= 0) {
                    o = !0;
                    break;
                  }
            }),
            {
              type: 6,
              styles: r,
              easing: s,
              offset: t.offset,
              containsDynamicStyles: o,
              options: null,
            }
          );
        }
        _validateStyleAst(t, e) {
          const r = e.currentAnimateTimings;
          let i = e.currentTime,
            o = e.currentTime;
          r && o > 0 && (o -= r.duration + r.delay),
            t.styles.forEach((s) => {
              "string" != typeof s &&
                s.forEach((a, l) => {
                  const u = e.collectedStyles.get(e.currentQuerySelector),
                    c = u.get(l);
                  let d = !0;
                  c &&
                    (o != i &&
                      o >= c.startTime &&
                      i <= c.endTime &&
                      (e.errors.push(
                        (function qU(n, t, e, r, i) {
                          return new b(3010, !1);
                        })()
                      ),
                      (d = !1)),
                    (o = c.startTime)),
                    d && u.set(l, { startTime: o, endTime: i }),
                    e.options &&
                      (function wj(n, t, e) {
                        const r = t.params || {},
                          i = _M(n);
                        i.length &&
                          i.forEach((o) => {
                            r.hasOwnProperty(o) ||
                              e.push(
                                (function VU(n) {
                                  return new b(3001, !1);
                                })()
                              );
                          });
                      })(a, e.options, e.errors);
                });
            });
        }
        visitKeyframes(t, e) {
          const r = { type: 5, styles: [], options: null };
          if (!e.currentAnimateTimings)
            return (
              e.errors.push(
                (function WU() {
                  return new b(3011, !1);
                })()
              ),
              r
            );
          let o = 0;
          const s = [];
          let a = !1,
            l = !1,
            u = 0;
          const c = t.steps.map((D) => {
            const E = this._makeStyleAst(D, e);
            let _ =
                null != E.offset
                  ? E.offset
                  : (function Hj(n) {
                      if ("string" == typeof n) return null;
                      let t = null;
                      if (Array.isArray(n))
                        n.forEach((e) => {
                          if (e instanceof Map && e.has("offset")) {
                            const r = e;
                            (t = parseFloat(r.get("offset"))),
                              r.delete("offset");
                          }
                        });
                      else if (n instanceof Map && n.has("offset")) {
                        const e = n;
                        (t = parseFloat(e.get("offset"))), e.delete("offset");
                      }
                      return t;
                    })(E.styles),
              F = 0;
            return (
              null != _ && (o++, (F = E.offset = _)),
              (l = l || F < 0 || F > 1),
              (a = a || F < u),
              (u = F),
              s.push(F),
              E
            );
          });
          l &&
            e.errors.push(
              (function KU() {
                return new b(3012, !1);
              })()
            ),
            a &&
              e.errors.push(
                (function QU() {
                  return new b(3200, !1);
                })()
              );
          const d = t.steps.length;
          let h = 0;
          o > 0 && o < d
            ? e.errors.push(
                (function YU() {
                  return new b(3202, !1);
                })()
              )
            : 0 == o && (h = 1 / (d - 1));
          const f = d - 1,
            p = e.currentTime,
            m = e.currentAnimateTimings,
            y = m.duration;
          return (
            c.forEach((D, E) => {
              const _ = h > 0 ? (E == f ? 1 : h * E) : s[E],
                F = _ * y;
              (e.currentTime = p + m.delay + F),
                (m.duration = F),
                this._validateStyleAst(D, e),
                (D.offset = _),
                r.styles.push(D);
            }),
            r
          );
        }
        visitReference(t, e) {
          return {
            type: 8,
            animation: Lt(this, Qs(t.animation), e),
            options: ri(t.options),
          };
        }
        visitAnimateChild(t, e) {
          return e.depCount++, { type: 9, options: ri(t.options) };
        }
        visitAnimateRef(t, e) {
          return {
            type: 10,
            animation: this.visitReference(t.animation, e),
            options: ri(t.options),
          };
        }
        visitQuery(t, e) {
          const r = e.currentQuerySelector,
            i = t.options || {};
          e.queryCount++, (e.currentQuery = t);
          const [o, s] = (function Lj(n) {
            const t = !!n.split(/\s*,\s*/).find((e) => ":self" == e);
            return (
              t && (n = n.replace(Oj, "")),
              (n = n
                .replace(/@\*/g, Tu)
                .replace(/@\w+/g, (e) => Tu + "-" + e.slice(1))
                .replace(/:animating/g, dp)),
              [n, t]
            );
          })(t.selector);
          (e.currentQuerySelector = r.length ? r + " " + o : o),
            Pt(e.collectedStyles, e.currentQuerySelector, new Map());
          const a = Lt(this, Qs(t.animation), e);
          return (
            (e.currentQuery = null),
            (e.currentQuerySelector = r),
            {
              type: 11,
              selector: o,
              limit: i.limit || 0,
              optional: !!i.optional,
              includeSelf: s,
              animation: a,
              originalSelector: t.selector,
              options: ri(t.options),
            }
          );
        }
        visitStagger(t, e) {
          e.currentQuery ||
            e.errors.push(
              (function ZU() {
                return new b(3013, !1);
              })()
            );
          const r =
            "full" === t.timings
              ? { duration: 0, delay: 0, easing: "full" }
              : Fu(t.timings, e.errors, !0);
          return {
            type: 12,
            animation: Lt(this, Qs(t.animation), e),
            timings: r,
            options: null,
          };
        }
      }
      class Bj {
        constructor(t) {
          (this.errors = t),
            (this.queryCount = 0),
            (this.depCount = 0),
            (this.currentTransition = null),
            (this.currentQuery = null),
            (this.currentQuerySelector = null),
            (this.currentAnimateTimings = null),
            (this.currentTime = 0),
            (this.collectedStyles = new Map()),
            (this.options = null),
            (this.unsupportedCSSPropertiesFound = new Set());
        }
      }
      function ri(n) {
        return (
          n
            ? (n = Ks(n)).params &&
              (n.params = (function Vj(n) {
                return n ? Ks(n) : null;
              })(n.params))
            : (n = {}),
          n
        );
      }
      function gp(n, t, e) {
        return { duration: n, delay: t, easing: e };
      }
      function yp(n, t, e, r, i, o, s = null, a = !1) {
        return {
          type: 1,
          element: n,
          keyframes: t,
          preStyleProps: e,
          postStyleProps: r,
          duration: i,
          delay: o,
          totalTime: i + o,
          easing: s,
          subTimeline: a,
        };
      }
      class Lu {
        constructor() {
          this._map = new Map();
        }
        get(t) {
          return this._map.get(t) || [];
        }
        append(t, e) {
          let r = this._map.get(t);
          r || this._map.set(t, (r = [])), r.push(...e);
        }
        has(t) {
          return this._map.has(t);
        }
        clear() {
          this._map.clear();
        }
      }
      const zj = new RegExp(":enter", "g"),
        qj = new RegExp(":leave", "g");
      function _p(n, t, e, r, i, o = new Map(), s = new Map(), a, l, u = []) {
        return new Wj().buildKeyframes(n, t, e, r, i, o, s, a, l, u);
      }
      class Wj {
        buildKeyframes(t, e, r, i, o, s, a, l, u, c = []) {
          u = u || new Lu();
          const d = new vp(t, e, u, i, o, c, []);
          d.options = l;
          const h = l.delay ? Xn(l.delay) : 0;
          d.currentTimeline.delayNextStep(h),
            d.currentTimeline.setStyles([s], null, d.errors, l),
            Lt(this, r, d);
          const f = d.timelines.filter((p) => p.containsAnimation());
          if (f.length && a.size) {
            let p;
            for (let m = f.length - 1; m >= 0; m--) {
              const y = f[m];
              if (y.element === e) {
                p = y;
                break;
              }
            }
            p &&
              !p.allowOnlyTimelineStyles() &&
              p.setStyles([a], null, d.errors, l);
          }
          return f.length
            ? f.map((p) => p.buildKeyframes())
            : [yp(e, [], [], [], 0, h, "", !1)];
        }
        visitTrigger(t, e) {}
        visitState(t, e) {}
        visitTransition(t, e) {}
        visitAnimateChild(t, e) {
          const r = e.subInstructions.get(e.element);
          if (r) {
            const i = e.createSubContext(t.options),
              o = e.currentTimeline.currentTime,
              s = this._visitSubInstructions(r, i, i.options);
            o != s && e.transformIntoNewTimeline(s);
          }
          e.previousNode = t;
        }
        visitAnimateRef(t, e) {
          const r = e.createSubContext(t.options);
          r.transformIntoNewTimeline(),
            this._applyAnimationRefDelays(
              [t.options, t.animation.options],
              e,
              r
            ),
            this.visitReference(t.animation, r),
            e.transformIntoNewTimeline(r.currentTimeline.currentTime),
            (e.previousNode = t);
        }
        _applyAnimationRefDelays(t, e, r) {
          for (const i of t) {
            const o = i?.delay;
            if (o) {
              const s =
                "number" == typeof o ? o : Xn(Ys(o, i?.params ?? {}, e.errors));
              r.delayNextStep(s);
            }
          }
        }
        _visitSubInstructions(t, e, r) {
          let o = e.currentTimeline.currentTime;
          const s = null != r.duration ? Xn(r.duration) : null,
            a = null != r.delay ? Xn(r.delay) : null;
          return (
            0 !== s &&
              t.forEach((l) => {
                const u = e.appendInstructionToTimeline(l, s, a);
                o = Math.max(o, u.duration + u.delay);
              }),
            o
          );
        }
        visitReference(t, e) {
          e.updateOptions(t.options, !0),
            Lt(this, t.animation, e),
            (e.previousNode = t);
        }
        visitSequence(t, e) {
          const r = e.subContextCount;
          let i = e;
          const o = t.options;
          if (
            o &&
            (o.params || o.delay) &&
            ((i = e.createSubContext(o)),
            i.transformIntoNewTimeline(),
            null != o.delay)
          ) {
            6 == i.previousNode.type &&
              (i.currentTimeline.snapshotCurrentStyles(),
              (i.previousNode = Vu));
            const s = Xn(o.delay);
            i.delayNextStep(s);
          }
          t.steps.length &&
            (t.steps.forEach((s) => Lt(this, s, i)),
            i.currentTimeline.applyStylesToKeyframe(),
            i.subContextCount > r && i.transformIntoNewTimeline()),
            (e.previousNode = t);
        }
        visitGroup(t, e) {
          const r = [];
          let i = e.currentTimeline.currentTime;
          const o = t.options && t.options.delay ? Xn(t.options.delay) : 0;
          t.steps.forEach((s) => {
            const a = e.createSubContext(t.options);
            o && a.delayNextStep(o),
              Lt(this, s, a),
              (i = Math.max(i, a.currentTimeline.currentTime)),
              r.push(a.currentTimeline);
          }),
            r.forEach((s) => e.currentTimeline.mergeTimelineCollectedStyles(s)),
            e.transformIntoNewTimeline(i),
            (e.previousNode = t);
        }
        _visitTiming(t, e) {
          if (t.dynamic) {
            const r = t.strValue;
            return Fu(e.params ? Ys(r, e.params, e.errors) : r, e.errors);
          }
          return { duration: t.duration, delay: t.delay, easing: t.easing };
        }
        visitAnimate(t, e) {
          const r = (e.currentAnimateTimings = this._visitTiming(t.timings, e)),
            i = e.currentTimeline;
          r.delay && (e.incrementTime(r.delay), i.snapshotCurrentStyles());
          const o = t.style;
          5 == o.type
            ? this.visitKeyframes(o, e)
            : (e.incrementTime(r.duration),
              this.visitStyle(o, e),
              i.applyStylesToKeyframe()),
            (e.currentAnimateTimings = null),
            (e.previousNode = t);
        }
        visitStyle(t, e) {
          const r = e.currentTimeline,
            i = e.currentAnimateTimings;
          !i && r.hasCurrentStyleProperties() && r.forwardFrame();
          const o = (i && i.easing) || t.easing;
          t.isEmptyStep
            ? r.applyEmptyStep(o)
            : r.setStyles(t.styles, o, e.errors, e.options),
            (e.previousNode = t);
        }
        visitKeyframes(t, e) {
          const r = e.currentAnimateTimings,
            i = e.currentTimeline.duration,
            o = r.duration,
            a = e.createSubContext().currentTimeline;
          (a.easing = r.easing),
            t.styles.forEach((l) => {
              a.forwardTime((l.offset || 0) * o),
                a.setStyles(l.styles, l.easing, e.errors, e.options),
                a.applyStylesToKeyframe();
            }),
            e.currentTimeline.mergeTimelineCollectedStyles(a),
            e.transformIntoNewTimeline(i + o),
            (e.previousNode = t);
        }
        visitQuery(t, e) {
          const r = e.currentTimeline.currentTime,
            i = t.options || {},
            o = i.delay ? Xn(i.delay) : 0;
          o &&
            (6 === e.previousNode.type ||
              (0 == r && e.currentTimeline.hasCurrentStyleProperties())) &&
            (e.currentTimeline.snapshotCurrentStyles(), (e.previousNode = Vu));
          let s = r;
          const a = e.invokeQuery(
            t.selector,
            t.originalSelector,
            t.limit,
            t.includeSelf,
            !!i.optional,
            e.errors
          );
          e.currentQueryTotal = a.length;
          let l = null;
          a.forEach((u, c) => {
            e.currentQueryIndex = c;
            const d = e.createSubContext(t.options, u);
            o && d.delayNextStep(o),
              u === e.element && (l = d.currentTimeline),
              Lt(this, t.animation, d),
              d.currentTimeline.applyStylesToKeyframe(),
              (s = Math.max(s, d.currentTimeline.currentTime));
          }),
            (e.currentQueryIndex = 0),
            (e.currentQueryTotal = 0),
            e.transformIntoNewTimeline(s),
            l &&
              (e.currentTimeline.mergeTimelineCollectedStyles(l),
              e.currentTimeline.snapshotCurrentStyles()),
            (e.previousNode = t);
        }
        visitStagger(t, e) {
          const r = e.parentContext,
            i = e.currentTimeline,
            o = t.timings,
            s = Math.abs(o.duration),
            a = s * (e.currentQueryTotal - 1);
          let l = s * e.currentQueryIndex;
          switch (o.duration < 0 ? "reverse" : o.easing) {
            case "reverse":
              l = a - l;
              break;
            case "full":
              l = r.currentStaggerTime;
          }
          const c = e.currentTimeline;
          l && c.delayNextStep(l);
          const d = c.currentTime;
          Lt(this, t.animation, e),
            (e.previousNode = t),
            (r.currentStaggerTime =
              i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
        }
      }
      const Vu = {};
      class vp {
        constructor(t, e, r, i, o, s, a, l) {
          (this._driver = t),
            (this.element = e),
            (this.subInstructions = r),
            (this._enterClassName = i),
            (this._leaveClassName = o),
            (this.errors = s),
            (this.timelines = a),
            (this.parentContext = null),
            (this.currentAnimateTimings = null),
            (this.previousNode = Vu),
            (this.subContextCount = 0),
            (this.options = {}),
            (this.currentQueryIndex = 0),
            (this.currentQueryTotal = 0),
            (this.currentStaggerTime = 0),
            (this.currentTimeline = l || new Bu(this._driver, e, 0)),
            a.push(this.currentTimeline);
        }
        get params() {
          return this.options.params;
        }
        updateOptions(t, e) {
          if (!t) return;
          const r = t;
          let i = this.options;
          null != r.duration && (i.duration = Xn(r.duration)),
            null != r.delay && (i.delay = Xn(r.delay));
          const o = r.params;
          if (o) {
            let s = i.params;
            s || (s = this.options.params = {}),
              Object.keys(o).forEach((a) => {
                (!e || !s.hasOwnProperty(a)) &&
                  (s[a] = Ys(o[a], s, this.errors));
              });
          }
        }
        _copyOptions() {
          const t = {};
          if (this.options) {
            const e = this.options.params;
            if (e) {
              const r = (t.params = {});
              Object.keys(e).forEach((i) => {
                r[i] = e[i];
              });
            }
          }
          return t;
        }
        createSubContext(t = null, e, r) {
          const i = e || this.element,
            o = new vp(
              this._driver,
              i,
              this.subInstructions,
              this._enterClassName,
              this._leaveClassName,
              this.errors,
              this.timelines,
              this.currentTimeline.fork(i, r || 0)
            );
          return (
            (o.previousNode = this.previousNode),
            (o.currentAnimateTimings = this.currentAnimateTimings),
            (o.options = this._copyOptions()),
            o.updateOptions(t),
            (o.currentQueryIndex = this.currentQueryIndex),
            (o.currentQueryTotal = this.currentQueryTotal),
            (o.parentContext = this),
            this.subContextCount++,
            o
          );
        }
        transformIntoNewTimeline(t) {
          return (
            (this.previousNode = Vu),
            (this.currentTimeline = this.currentTimeline.fork(this.element, t)),
            this.timelines.push(this.currentTimeline),
            this.currentTimeline
          );
        }
        appendInstructionToTimeline(t, e, r) {
          const i = {
              duration: e ?? t.duration,
              delay: this.currentTimeline.currentTime + (r ?? 0) + t.delay,
              easing: "",
            },
            o = new Kj(
              this._driver,
              t.element,
              t.keyframes,
              t.preStyleProps,
              t.postStyleProps,
              i,
              t.stretchStartingKeyframe
            );
          return this.timelines.push(o), i;
        }
        incrementTime(t) {
          this.currentTimeline.forwardTime(this.currentTimeline.duration + t);
        }
        delayNextStep(t) {
          t > 0 && this.currentTimeline.delayNextStep(t);
        }
        invokeQuery(t, e, r, i, o, s) {
          let a = [];
          if ((i && a.push(this.element), t.length > 0)) {
            t = (t = t.replace(zj, "." + this._enterClassName)).replace(
              qj,
              "." + this._leaveClassName
            );
            let u = this._driver.query(this.element, t, 1 != r);
            0 !== r &&
              (u = r < 0 ? u.slice(u.length + r, u.length) : u.slice(0, r)),
              a.push(...u);
          }
          return (
            !o &&
              0 == a.length &&
              s.push(
                (function XU(n) {
                  return new b(3014, !1);
                })()
              ),
            a
          );
        }
      }
      class Bu {
        constructor(t, e, r, i) {
          (this._driver = t),
            (this.element = e),
            (this.startTime = r),
            (this._elementTimelineStylesLookup = i),
            (this.duration = 0),
            (this._previousKeyframe = new Map()),
            (this._currentKeyframe = new Map()),
            (this._keyframes = new Map()),
            (this._styleSummary = new Map()),
            (this._localTimelineStyles = new Map()),
            (this._pendingStyles = new Map()),
            (this._backFill = new Map()),
            (this._currentEmptyStepKeyframe = null),
            this._elementTimelineStylesLookup ||
              (this._elementTimelineStylesLookup = new Map()),
            (this._globalTimelineStyles =
              this._elementTimelineStylesLookup.get(e)),
            this._globalTimelineStyles ||
              ((this._globalTimelineStyles = this._localTimelineStyles),
              this._elementTimelineStylesLookup.set(
                e,
                this._localTimelineStyles
              )),
            this._loadKeyframe();
        }
        containsAnimation() {
          switch (this._keyframes.size) {
            case 0:
              return !1;
            case 1:
              return this.hasCurrentStyleProperties();
            default:
              return !0;
          }
        }
        hasCurrentStyleProperties() {
          return this._currentKeyframe.size > 0;
        }
        get currentTime() {
          return this.startTime + this.duration;
        }
        delayNextStep(t) {
          const e = 1 === this._keyframes.size && this._pendingStyles.size;
          this.duration || e
            ? (this.forwardTime(this.currentTime + t),
              e && this.snapshotCurrentStyles())
            : (this.startTime += t);
        }
        fork(t, e) {
          return (
            this.applyStylesToKeyframe(),
            new Bu(
              this._driver,
              t,
              e || this.currentTime,
              this._elementTimelineStylesLookup
            )
          );
        }
        _loadKeyframe() {
          this._currentKeyframe &&
            (this._previousKeyframe = this._currentKeyframe),
            (this._currentKeyframe = this._keyframes.get(this.duration)),
            this._currentKeyframe ||
              ((this._currentKeyframe = new Map()),
              this._keyframes.set(this.duration, this._currentKeyframe));
        }
        forwardFrame() {
          (this.duration += 1), this._loadKeyframe();
        }
        forwardTime(t) {
          this.applyStylesToKeyframe(),
            (this.duration = t),
            this._loadKeyframe();
        }
        _updateStyle(t, e) {
          this._localTimelineStyles.set(t, e),
            this._globalTimelineStyles.set(t, e),
            this._styleSummary.set(t, { time: this.currentTime, value: e });
        }
        allowOnlyTimelineStyles() {
          return this._currentEmptyStepKeyframe !== this._currentKeyframe;
        }
        applyEmptyStep(t) {
          t && this._previousKeyframe.set("easing", t);
          for (let [e, r] of this._globalTimelineStyles)
            this._backFill.set(e, r || Wn), this._currentKeyframe.set(e, Wn);
          this._currentEmptyStepKeyframe = this._currentKeyframe;
        }
        setStyles(t, e, r, i) {
          e && this._previousKeyframe.set("easing", e);
          const o = (i && i.params) || {},
            s = (function Qj(n, t) {
              const e = new Map();
              let r;
              return (
                n.forEach((i) => {
                  if ("*" === i) {
                    r = r || t.keys();
                    for (let o of r) e.set(o, Wn);
                  } else Sr(i, e);
                }),
                e
              );
            })(t, this._globalTimelineStyles);
          for (let [a, l] of s) {
            const u = Ys(l, o, r);
            this._pendingStyles.set(a, u),
              this._localTimelineStyles.has(a) ||
                this._backFill.set(a, this._globalTimelineStyles.get(a) ?? Wn),
              this._updateStyle(a, u);
          }
        }
        applyStylesToKeyframe() {
          0 != this._pendingStyles.size &&
            (this._pendingStyles.forEach((t, e) => {
              this._currentKeyframe.set(e, t);
            }),
            this._pendingStyles.clear(),
            this._localTimelineStyles.forEach((t, e) => {
              this._currentKeyframe.has(e) || this._currentKeyframe.set(e, t);
            }));
        }
        snapshotCurrentStyles() {
          for (let [t, e] of this._localTimelineStyles)
            this._pendingStyles.set(t, e), this._updateStyle(t, e);
        }
        getFinalKeyframe() {
          return this._keyframes.get(this.duration);
        }
        get properties() {
          const t = [];
          for (let e in this._currentKeyframe) t.push(e);
          return t;
        }
        mergeTimelineCollectedStyles(t) {
          t._styleSummary.forEach((e, r) => {
            const i = this._styleSummary.get(r);
            (!i || e.time > i.time) && this._updateStyle(r, e.value);
          });
        }
        buildKeyframes() {
          this.applyStylesToKeyframe();
          const t = new Set(),
            e = new Set(),
            r = 1 === this._keyframes.size && 0 === this.duration;
          let i = [];
          this._keyframes.forEach((a, l) => {
            const u = Sr(a, new Map(), this._backFill);
            u.forEach((c, d) => {
              "!" === c ? t.add(d) : c === Wn && e.add(d);
            }),
              r || u.set("offset", l / this.duration),
              i.push(u);
          });
          const o = t.size ? xu(t.values()) : [],
            s = e.size ? xu(e.values()) : [];
          if (r) {
            const a = i[0],
              l = new Map(a);
            a.set("offset", 0), l.set("offset", 1), (i = [a, l]);
          }
          return yp(
            this.element,
            i,
            o,
            s,
            this.duration,
            this.startTime,
            this.easing,
            !1
          );
        }
      }
      class Kj extends Bu {
        constructor(t, e, r, i, o, s, a = !1) {
          super(t, e, s.delay),
            (this.keyframes = r),
            (this.preStyleProps = i),
            (this.postStyleProps = o),
            (this._stretchStartingKeyframe = a),
            (this.timings = {
              duration: s.duration,
              delay: s.delay,
              easing: s.easing,
            });
        }
        containsAnimation() {
          return this.keyframes.length > 1;
        }
        buildKeyframes() {
          let t = this.keyframes,
            { delay: e, duration: r, easing: i } = this.timings;
          if (this._stretchStartingKeyframe && e) {
            const o = [],
              s = r + e,
              a = e / s,
              l = Sr(t[0]);
            l.set("offset", 0), o.push(l);
            const u = Sr(t[0]);
            u.set("offset", EM(a)), o.push(u);
            const c = t.length - 1;
            for (let d = 1; d <= c; d++) {
              let h = Sr(t[d]);
              const f = h.get("offset");
              h.set("offset", EM((e + f * r) / s)), o.push(h);
            }
            (r = s), (e = 0), (i = ""), (t = o);
          }
          return yp(
            this.element,
            t,
            this.preStyleProps,
            this.postStyleProps,
            r,
            e,
            i,
            !0
          );
        }
      }
      function EM(n, t = 3) {
        const e = Math.pow(10, t - 1);
        return Math.round(n * e) / e;
      }
      class bp {}
      const Yj = new Set([
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "left",
        "top",
        "bottom",
        "right",
        "fontSize",
        "outlineWidth",
        "outlineOffset",
        "paddingTop",
        "paddingLeft",
        "paddingBottom",
        "paddingRight",
        "marginTop",
        "marginLeft",
        "marginBottom",
        "marginRight",
        "borderRadius",
        "borderWidth",
        "borderTopWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "textIndent",
        "perspective",
      ]);
      class Zj extends bp {
        normalizePropertyName(t, e) {
          return pp(t);
        }
        normalizeStyleValue(t, e, r, i) {
          let o = "";
          const s = r.toString().trim();
          if (Yj.has(e) && 0 !== r && "0" !== r)
            if ("number" == typeof r) o = "px";
            else {
              const a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
              a &&
                0 == a[1].length &&
                i.push(
                  (function UU(n, t) {
                    return new b(3005, !1);
                  })()
                );
            }
          return s + o;
        }
      }
      function wM(n, t, e, r, i, o, s, a, l, u, c, d, h) {
        return {
          type: 0,
          element: n,
          triggerName: t,
          isRemovalTransition: i,
          fromState: e,
          fromStyles: o,
          toState: r,
          toStyles: s,
          timelines: a,
          queriedElements: l,
          preStyleProps: u,
          postStyleProps: c,
          totalTime: d,
          errors: h,
        };
      }
      const Cp = {};
      class MM {
        constructor(t, e, r) {
          (this._triggerName = t), (this.ast = e), (this._stateStyles = r);
        }
        match(t, e, r, i) {
          return (function Xj(n, t, e, r, i) {
            return n.some((o) => o(t, e, r, i));
          })(this.ast.matchers, t, e, r, i);
        }
        buildStyles(t, e, r) {
          let i = this._stateStyles.get("*");
          return (
            void 0 !== t && (i = this._stateStyles.get(t?.toString()) || i),
            i ? i.buildStyles(e, r) : new Map()
          );
        }
        build(t, e, r, i, o, s, a, l, u, c) {
          const d = [],
            h = (this.ast.options && this.ast.options.params) || Cp,
            p = this.buildStyles(r, (a && a.params) || Cp, d),
            m = (l && l.params) || Cp,
            y = this.buildStyles(i, m, d),
            D = new Set(),
            E = new Map(),
            _ = new Map(),
            F = "void" === i,
            te = { params: Jj(m, h), delay: this.ast.options?.delay },
            se = c ? [] : _p(t, e, this.ast.animation, o, s, p, y, te, u, d);
          let ut = 0;
          if (
            (se.forEach((er) => {
              ut = Math.max(er.duration + er.delay, ut);
            }),
            d.length)
          )
            return wM(e, this._triggerName, r, i, F, p, y, [], [], E, _, ut, d);
          se.forEach((er) => {
            const tr = er.element,
              HM = Pt(E, tr, new Set());
            er.preStyleProps.forEach((ii) => HM.add(ii));
            const Xs = Pt(_, tr, new Set());
            er.postStyleProps.forEach((ii) => Xs.add(ii)),
              tr !== e && D.add(tr);
          });
          const Jn = xu(D.values());
          return wM(e, this._triggerName, r, i, F, p, y, se, Jn, E, _, ut);
        }
      }
      function Jj(n, t) {
        const e = Ks(t);
        for (const r in n) n.hasOwnProperty(r) && null != n[r] && (e[r] = n[r]);
        return e;
      }
      class e$ {
        constructor(t, e, r) {
          (this.styles = t), (this.defaultParams = e), (this.normalizer = r);
        }
        buildStyles(t, e) {
          const r = new Map(),
            i = Ks(this.defaultParams);
          return (
            Object.keys(t).forEach((o) => {
              const s = t[o];
              null !== s && (i[o] = s);
            }),
            this.styles.styles.forEach((o) => {
              "string" != typeof o &&
                o.forEach((s, a) => {
                  s && (s = Ys(s, i, e));
                  const l = this.normalizer.normalizePropertyName(a, e);
                  (s = this.normalizer.normalizeStyleValue(a, l, s, e)),
                    r.set(a, s);
                });
            }),
            r
          );
        }
      }
      class n$ {
        constructor(t, e, r) {
          (this.name = t),
            (this.ast = e),
            (this._normalizer = r),
            (this.transitionFactories = []),
            (this.states = new Map()),
            e.states.forEach((i) => {
              this.states.set(
                i.name,
                new e$(i.style, (i.options && i.options.params) || {}, r)
              );
            }),
            SM(this.states, "true", "1"),
            SM(this.states, "false", "0"),
            e.transitions.forEach((i) => {
              this.transitionFactories.push(new MM(t, i, this.states));
            }),
            (this.fallbackTransition = (function r$(n, t, e) {
              return new MM(
                n,
                {
                  type: 1,
                  animation: { type: 2, steps: [], options: null },
                  matchers: [(s, a) => !0],
                  options: null,
                  queryCount: 0,
                  depCount: 0,
                },
                t
              );
            })(t, this.states));
        }
        get containsQueries() {
          return this.ast.queryCount > 0;
        }
        matchTransition(t, e, r, i) {
          return (
            this.transitionFactories.find((s) => s.match(t, e, r, i)) || null
          );
        }
        matchStyles(t, e, r) {
          return this.fallbackTransition.buildStyles(t, e, r);
        }
      }
      function SM(n, t, e) {
        n.has(t)
          ? n.has(e) || n.set(e, n.get(t))
          : n.has(e) && n.set(t, n.get(e));
      }
      const i$ = new Lu();
      class o$ {
        constructor(t, e, r) {
          (this.bodyNode = t),
            (this._driver = e),
            (this._normalizer = r),
            (this._animations = new Map()),
            (this._playersById = new Map()),
            (this.players = []);
        }
        register(t, e) {
          const r = [],
            o = mp(this._driver, e, r, []);
          if (r.length)
            throw (function oj(n) {
              return new b(3503, !1);
            })();
          this._animations.set(t, o);
        }
        _buildPlayer(t, e, r) {
          const i = t.element,
            o = iM(0, this._normalizer, 0, t.keyframes, e, r);
          return this._driver.animate(
            i,
            o,
            t.duration,
            t.delay,
            t.easing,
            [],
            !0
          );
        }
        create(t, e, r = {}) {
          const i = [],
            o = this._animations.get(t);
          let s;
          const a = new Map();
          if (
            (o
              ? ((s = _p(
                  this._driver,
                  e,
                  o,
                  cp,
                  Au,
                  new Map(),
                  new Map(),
                  r,
                  i$,
                  i
                )),
                s.forEach((c) => {
                  const d = Pt(a, c.element, new Map());
                  c.postStyleProps.forEach((h) => d.set(h, null));
                }))
              : (i.push(
                  (function sj() {
                    return new b(3300, !1);
                  })()
                ),
                (s = [])),
            i.length)
          )
            throw (function aj(n) {
              return new b(3504, !1);
            })();
          a.forEach((c, d) => {
            c.forEach((h, f) => {
              c.set(f, this._driver.computeStyle(d, f, Wn));
            });
          });
          const u = Mr(
            s.map((c) => {
              const d = a.get(c.element);
              return this._buildPlayer(c, new Map(), d);
            })
          );
          return (
            this._playersById.set(t, u),
            u.onDestroy(() => this.destroy(t)),
            this.players.push(u),
            u
          );
        }
        destroy(t) {
          const e = this._getPlayer(t);
          e.destroy(), this._playersById.delete(t);
          const r = this.players.indexOf(e);
          r >= 0 && this.players.splice(r, 1);
        }
        _getPlayer(t) {
          const e = this._playersById.get(t);
          if (!e)
            throw (function lj(n) {
              return new b(3301, !1);
            })();
          return e;
        }
        listen(t, e, r, i) {
          const o = sp(e, "", "", "");
          return ip(this._getPlayer(t), r, o, i), () => {};
        }
        command(t, e, r, i) {
          if ("register" == r) return void this.register(t, i[0]);
          if ("create" == r) return void this.create(t, e, i[0] || {});
          const o = this._getPlayer(t);
          switch (r) {
            case "play":
              o.play();
              break;
            case "pause":
              o.pause();
              break;
            case "reset":
              o.reset();
              break;
            case "restart":
              o.restart();
              break;
            case "finish":
              o.finish();
              break;
            case "init":
              o.init();
              break;
            case "setPosition":
              o.setPosition(parseFloat(i[0]));
              break;
            case "destroy":
              this.destroy(t);
          }
        }
      }
      const AM = "ng-animate-queued",
        Dp = "ng-animate-disabled",
        c$ = [],
        IM = {
          namespaceId: "",
          setForRemoval: !1,
          setForMove: !1,
          hasAnimation: !1,
          removedBeforeQueried: !1,
        },
        d$ = {
          namespaceId: "",
          setForMove: !1,
          setForRemoval: !1,
          hasAnimation: !1,
          removedBeforeQueried: !0,
        },
        Zt = "__ng_removed";
      class Ep {
        constructor(t, e = "") {
          this.namespaceId = e;
          const r = t && t.hasOwnProperty("value");
          if (
            ((this.value = (function m$(n) {
              return n ?? null;
            })(r ? t.value : t)),
            r)
          ) {
            const o = Ks(t);
            delete o.value, (this.options = o);
          } else this.options = {};
          this.options.params || (this.options.params = {});
        }
        get params() {
          return this.options.params;
        }
        absorbOptions(t) {
          const e = t.params;
          if (e) {
            const r = this.options.params;
            Object.keys(e).forEach((i) => {
              null == r[i] && (r[i] = e[i]);
            });
          }
        }
      }
      const Zs = "void",
        wp = new Ep(Zs);
      class h$ {
        constructor(t, e, r) {
          (this.id = t),
            (this.hostElement = e),
            (this._engine = r),
            (this.players = []),
            (this._triggers = new Map()),
            (this._queue = []),
            (this._elementListeners = new Map()),
            (this._hostClassName = "ng-tns-" + t),
            Xt(e, this._hostClassName);
        }
        listen(t, e, r, i) {
          if (!this._triggers.has(e))
            throw (function uj(n, t) {
              return new b(3302, !1);
            })();
          if (null == r || 0 == r.length)
            throw (function cj(n) {
              return new b(3303, !1);
            })();
          if (
            !(function g$(n) {
              return "start" == n || "done" == n;
            })(r)
          )
            throw (function dj(n, t) {
              return new b(3400, !1);
            })();
          const o = Pt(this._elementListeners, t, []),
            s = { name: e, phase: r, callback: i };
          o.push(s);
          const a = Pt(this._engine.statesByElement, t, new Map());
          return (
            a.has(e) || (Xt(t, Iu), Xt(t, Iu + "-" + e), a.set(e, wp)),
            () => {
              this._engine.afterFlush(() => {
                const l = o.indexOf(s);
                l >= 0 && o.splice(l, 1), this._triggers.has(e) || a.delete(e);
              });
            }
          );
        }
        register(t, e) {
          return !this._triggers.has(t) && (this._triggers.set(t, e), !0);
        }
        _getTrigger(t) {
          const e = this._triggers.get(t);
          if (!e)
            throw (function hj(n) {
              return new b(3401, !1);
            })();
          return e;
        }
        trigger(t, e, r, i = !0) {
          const o = this._getTrigger(e),
            s = new Mp(this.id, e, t);
          let a = this._engine.statesByElement.get(t);
          a ||
            (Xt(t, Iu),
            Xt(t, Iu + "-" + e),
            this._engine.statesByElement.set(t, (a = new Map())));
          let l = a.get(e);
          const u = new Ep(r, this.id);
          if (
            (!(r && r.hasOwnProperty("value")) &&
              l &&
              u.absorbOptions(l.options),
            a.set(e, u),
            l || (l = wp),
            u.value !== Zs && l.value === u.value)
          ) {
            if (
              !(function v$(n, t) {
                const e = Object.keys(n),
                  r = Object.keys(t);
                if (e.length != r.length) return !1;
                for (let i = 0; i < e.length; i++) {
                  const o = e[i];
                  if (!t.hasOwnProperty(o) || n[o] !== t[o]) return !1;
                }
                return !0;
              })(l.params, u.params)
            ) {
              const m = [],
                y = o.matchStyles(l.value, l.params, m),
                D = o.matchStyles(u.value, u.params, m);
              m.length
                ? this._engine.reportError(m)
                : this._engine.afterFlush(() => {
                    ni(t, y), xn(t, D);
                  });
            }
            return;
          }
          const h = Pt(this._engine.playersByElement, t, []);
          h.forEach((m) => {
            m.namespaceId == this.id &&
              m.triggerName == e &&
              m.queued &&
              m.destroy();
          });
          let f = o.matchTransition(l.value, u.value, t, u.params),
            p = !1;
          if (!f) {
            if (!i) return;
            (f = o.fallbackTransition), (p = !0);
          }
          return (
            this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: t,
              triggerName: e,
              transition: f,
              fromState: l,
              toState: u,
              player: s,
              isFallbackTransition: p,
            }),
            p ||
              (Xt(t, AM),
              s.onStart(() => {
                yo(t, AM);
              })),
            s.onDone(() => {
              let m = this.players.indexOf(s);
              m >= 0 && this.players.splice(m, 1);
              const y = this._engine.playersByElement.get(t);
              if (y) {
                let D = y.indexOf(s);
                D >= 0 && y.splice(D, 1);
              }
            }),
            this.players.push(s),
            h.push(s),
            s
          );
        }
        deregister(t) {
          this._triggers.delete(t),
            this._engine.statesByElement.forEach((e) => e.delete(t)),
            this._elementListeners.forEach((e, r) => {
              this._elementListeners.set(
                r,
                e.filter((i) => i.name != t)
              );
            });
        }
        clearElementCache(t) {
          this._engine.statesByElement.delete(t),
            this._elementListeners.delete(t);
          const e = this._engine.playersByElement.get(t);
          e &&
            (e.forEach((r) => r.destroy()),
            this._engine.playersByElement.delete(t));
        }
        _signalRemovalForInnerTriggers(t, e) {
          const r = this._engine.driver.query(t, Tu, !0);
          r.forEach((i) => {
            if (i[Zt]) return;
            const o = this._engine.fetchNamespacesByElement(i);
            o.size
              ? o.forEach((s) => s.triggerLeaveAnimation(i, e, !1, !0))
              : this.clearElementCache(i);
          }),
            this._engine.afterFlushAnimationsDone(() =>
              r.forEach((i) => this.clearElementCache(i))
            );
        }
        triggerLeaveAnimation(t, e, r, i) {
          const o = this._engine.statesByElement.get(t),
            s = new Map();
          if (o) {
            const a = [];
            if (
              (o.forEach((l, u) => {
                if ((s.set(u, l.value), this._triggers.has(u))) {
                  const c = this.trigger(t, u, Zs, i);
                  c && a.push(c);
                }
              }),
              a.length)
            )
              return (
                this._engine.markElementAsRemoved(this.id, t, !0, e, s),
                r && Mr(a).onDone(() => this._engine.processLeaveNode(t)),
                !0
              );
          }
          return !1;
        }
        prepareLeaveAnimationListeners(t) {
          const e = this._elementListeners.get(t),
            r = this._engine.statesByElement.get(t);
          if (e && r) {
            const i = new Set();
            e.forEach((o) => {
              const s = o.name;
              if (i.has(s)) return;
              i.add(s);
              const l = this._triggers.get(s).fallbackTransition,
                u = r.get(s) || wp,
                c = new Ep(Zs),
                d = new Mp(this.id, s, t);
              this._engine.totalQueuedPlayers++,
                this._queue.push({
                  element: t,
                  triggerName: s,
                  transition: l,
                  fromState: u,
                  toState: c,
                  player: d,
                  isFallbackTransition: !0,
                });
            });
          }
        }
        removeNode(t, e) {
          const r = this._engine;
          if (
            (t.childElementCount && this._signalRemovalForInnerTriggers(t, e),
            this.triggerLeaveAnimation(t, e, !0))
          )
            return;
          let i = !1;
          if (r.totalAnimations) {
            const o = r.players.length ? r.playersByQueriedElement.get(t) : [];
            if (o && o.length) i = !0;
            else {
              let s = t;
              for (; (s = s.parentNode); )
                if (r.statesByElement.get(s)) {
                  i = !0;
                  break;
                }
            }
          }
          if ((this.prepareLeaveAnimationListeners(t), i))
            r.markElementAsRemoved(this.id, t, !1, e);
          else {
            const o = t[Zt];
            (!o || o === IM) &&
              (r.afterFlush(() => this.clearElementCache(t)),
              r.destroyInnerAnimations(t),
              r._onRemovalComplete(t, e));
          }
        }
        insertNode(t, e) {
          Xt(t, this._hostClassName);
        }
        drainQueuedTransitions(t) {
          const e = [];
          return (
            this._queue.forEach((r) => {
              const i = r.player;
              if (i.destroyed) return;
              const o = r.element,
                s = this._elementListeners.get(o);
              s &&
                s.forEach((a) => {
                  if (a.name == r.triggerName) {
                    const l = sp(
                      o,
                      r.triggerName,
                      r.fromState.value,
                      r.toState.value
                    );
                    (l._data = t), ip(r.player, a.phase, l, a.callback);
                  }
                }),
                i.markedForDestroy
                  ? this._engine.afterFlush(() => {
                      i.destroy();
                    })
                  : e.push(r);
            }),
            (this._queue = []),
            e.sort((r, i) => {
              const o = r.transition.ast.depCount,
                s = i.transition.ast.depCount;
              return 0 == o || 0 == s
                ? o - s
                : this._engine.driver.containsElement(r.element, i.element)
                ? 1
                : -1;
            })
          );
        }
        destroy(t) {
          this.players.forEach((e) => e.destroy()),
            this._signalRemovalForInnerTriggers(this.hostElement, t);
        }
        elementContainsData(t) {
          let e = !1;
          return (
            this._elementListeners.has(t) && (e = !0),
            (e = !!this._queue.find((r) => r.element === t) || e),
            e
          );
        }
      }
      class f$ {
        constructor(t, e, r) {
          (this.bodyNode = t),
            (this.driver = e),
            (this._normalizer = r),
            (this.players = []),
            (this.newHostElements = new Map()),
            (this.playersByElement = new Map()),
            (this.playersByQueriedElement = new Map()),
            (this.statesByElement = new Map()),
            (this.disabledNodes = new Set()),
            (this.totalAnimations = 0),
            (this.totalQueuedPlayers = 0),
            (this._namespaceLookup = {}),
            (this._namespaceList = []),
            (this._flushFns = []),
            (this._whenQuietFns = []),
            (this.namespacesByHostElement = new Map()),
            (this.collectedEnterElements = []),
            (this.collectedLeaveElements = []),
            (this.onRemovalComplete = (i, o) => {});
        }
        _onRemovalComplete(t, e) {
          this.onRemovalComplete(t, e);
        }
        get queuedPlayers() {
          const t = [];
          return (
            this._namespaceList.forEach((e) => {
              e.players.forEach((r) => {
                r.queued && t.push(r);
              });
            }),
            t
          );
        }
        createNamespace(t, e) {
          const r = new h$(t, e, this);
          return (
            this.bodyNode && this.driver.containsElement(this.bodyNode, e)
              ? this._balanceNamespaceList(r, e)
              : (this.newHostElements.set(e, r), this.collectEnterElement(e)),
            (this._namespaceLookup[t] = r)
          );
        }
        _balanceNamespaceList(t, e) {
          const r = this._namespaceList,
            i = this.namespacesByHostElement;
          if (r.length - 1 >= 0) {
            let s = !1,
              a = this.driver.getParentElement(e);
            for (; a; ) {
              const l = i.get(a);
              if (l) {
                const u = r.indexOf(l);
                r.splice(u + 1, 0, t), (s = !0);
                break;
              }
              a = this.driver.getParentElement(a);
            }
            s || r.unshift(t);
          } else r.push(t);
          return i.set(e, t), t;
        }
        register(t, e) {
          let r = this._namespaceLookup[t];
          return r || (r = this.createNamespace(t, e)), r;
        }
        registerTrigger(t, e, r) {
          let i = this._namespaceLookup[t];
          i && i.register(e, r) && this.totalAnimations++;
        }
        destroy(t, e) {
          if (!t) return;
          const r = this._fetchNamespace(t);
          this.afterFlush(() => {
            this.namespacesByHostElement.delete(r.hostElement),
              delete this._namespaceLookup[t];
            const i = this._namespaceList.indexOf(r);
            i >= 0 && this._namespaceList.splice(i, 1);
          }),
            this.afterFlushAnimationsDone(() => r.destroy(e));
        }
        _fetchNamespace(t) {
          return this._namespaceLookup[t];
        }
        fetchNamespacesByElement(t) {
          const e = new Set(),
            r = this.statesByElement.get(t);
          if (r)
            for (let i of r.values())
              if (i.namespaceId) {
                const o = this._fetchNamespace(i.namespaceId);
                o && e.add(o);
              }
          return e;
        }
        trigger(t, e, r, i) {
          if (Hu(e)) {
            const o = this._fetchNamespace(t);
            if (o) return o.trigger(e, r, i), !0;
          }
          return !1;
        }
        insertNode(t, e, r, i) {
          if (!Hu(e)) return;
          const o = e[Zt];
          if (o && o.setForRemoval) {
            (o.setForRemoval = !1), (o.setForMove = !0);
            const s = this.collectedLeaveElements.indexOf(e);
            s >= 0 && this.collectedLeaveElements.splice(s, 1);
          }
          if (t) {
            const s = this._fetchNamespace(t);
            s && s.insertNode(e, r);
          }
          i && this.collectEnterElement(e);
        }
        collectEnterElement(t) {
          this.collectedEnterElements.push(t);
        }
        markElementAsDisabled(t, e) {
          e
            ? this.disabledNodes.has(t) ||
              (this.disabledNodes.add(t), Xt(t, Dp))
            : this.disabledNodes.has(t) &&
              (this.disabledNodes.delete(t), yo(t, Dp));
        }
        removeNode(t, e, r, i) {
          if (Hu(e)) {
            const o = t ? this._fetchNamespace(t) : null;
            if (
              (o ? o.removeNode(e, i) : this.markElementAsRemoved(t, e, !1, i),
              r)
            ) {
              const s = this.namespacesByHostElement.get(e);
              s && s.id !== t && s.removeNode(e, i);
            }
          } else this._onRemovalComplete(e, i);
        }
        markElementAsRemoved(t, e, r, i, o) {
          this.collectedLeaveElements.push(e),
            (e[Zt] = {
              namespaceId: t,
              setForRemoval: i,
              hasAnimation: r,
              removedBeforeQueried: !1,
              previousTriggersValues: o,
            });
        }
        listen(t, e, r, i, o) {
          return Hu(e) ? this._fetchNamespace(t).listen(e, r, i, o) : () => {};
        }
        _buildInstruction(t, e, r, i, o) {
          return t.transition.build(
            this.driver,
            t.element,
            t.fromState.value,
            t.toState.value,
            r,
            i,
            t.fromState.options,
            t.toState.options,
            e,
            o
          );
        }
        destroyInnerAnimations(t) {
          let e = this.driver.query(t, Tu, !0);
          e.forEach((r) => this.destroyActiveAnimationsForElement(r)),
            0 != this.playersByQueriedElement.size &&
              ((e = this.driver.query(t, dp, !0)),
              e.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
        }
        destroyActiveAnimationsForElement(t) {
          const e = this.playersByElement.get(t);
          e &&
            e.forEach((r) => {
              r.queued ? (r.markedForDestroy = !0) : r.destroy();
            });
        }
        finishActiveQueriedAnimationOnElement(t) {
          const e = this.playersByQueriedElement.get(t);
          e && e.forEach((r) => r.finish());
        }
        whenRenderingDone() {
          return new Promise((t) => {
            if (this.players.length) return Mr(this.players).onDone(() => t());
            t();
          });
        }
        processLeaveNode(t) {
          const e = t[Zt];
          if (e && e.setForRemoval) {
            if (((t[Zt] = IM), e.namespaceId)) {
              this.destroyInnerAnimations(t);
              const r = this._fetchNamespace(e.namespaceId);
              r && r.clearElementCache(t);
            }
            this._onRemovalComplete(t, e.setForRemoval);
          }
          t.classList?.contains(Dp) && this.markElementAsDisabled(t, !1),
            this.driver.query(t, ".ng-animate-disabled", !0).forEach((r) => {
              this.markElementAsDisabled(r, !1);
            });
        }
        flush(t = -1) {
          let e = [];
          if (
            (this.newHostElements.size &&
              (this.newHostElements.forEach((r, i) =>
                this._balanceNamespaceList(r, i)
              ),
              this.newHostElements.clear()),
            this.totalAnimations && this.collectedEnterElements.length)
          )
            for (let r = 0; r < this.collectedEnterElements.length; r++)
              Xt(this.collectedEnterElements[r], "ng-star-inserted");
          if (
            this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)
          ) {
            const r = [];
            try {
              e = this._flushAnimations(r, t);
            } finally {
              for (let i = 0; i < r.length; i++) r[i]();
            }
          } else
            for (let r = 0; r < this.collectedLeaveElements.length; r++)
              this.processLeaveNode(this.collectedLeaveElements[r]);
          if (
            ((this.totalQueuedPlayers = 0),
            (this.collectedEnterElements.length = 0),
            (this.collectedLeaveElements.length = 0),
            this._flushFns.forEach((r) => r()),
            (this._flushFns = []),
            this._whenQuietFns.length)
          ) {
            const r = this._whenQuietFns;
            (this._whenQuietFns = []),
              e.length
                ? Mr(e).onDone(() => {
                    r.forEach((i) => i());
                  })
                : r.forEach((i) => i());
          }
        }
        reportError(t) {
          throw (function fj(n) {
            return new b(3402, !1);
          })();
        }
        _flushAnimations(t, e) {
          const r = new Lu(),
            i = [],
            o = new Map(),
            s = [],
            a = new Map(),
            l = new Map(),
            u = new Map(),
            c = new Set();
          this.disabledNodes.forEach((x) => {
            c.add(x);
            const N = this.driver.query(x, ".ng-animate-queued", !0);
            for (let V = 0; V < N.length; V++) c.add(N[V]);
          });
          const d = this.bodyNode,
            h = Array.from(this.statesByElement.keys()),
            f = xM(h, this.collectedEnterElements),
            p = new Map();
          let m = 0;
          f.forEach((x, N) => {
            const V = cp + m++;
            p.set(N, V), x.forEach((ne) => Xt(ne, V));
          });
          const y = [],
            D = new Set(),
            E = new Set();
          for (let x = 0; x < this.collectedLeaveElements.length; x++) {
            const N = this.collectedLeaveElements[x],
              V = N[Zt];
            V &&
              V.setForRemoval &&
              (y.push(N),
              D.add(N),
              V.hasAnimation
                ? this.driver
                    .query(N, ".ng-star-inserted", !0)
                    .forEach((ne) => D.add(ne))
                : E.add(N));
          }
          const _ = new Map(),
            F = xM(h, Array.from(D));
          F.forEach((x, N) => {
            const V = Au + m++;
            _.set(N, V), x.forEach((ne) => Xt(ne, V));
          }),
            t.push(() => {
              f.forEach((x, N) => {
                const V = p.get(N);
                x.forEach((ne) => yo(ne, V));
              }),
                F.forEach((x, N) => {
                  const V = _.get(N);
                  x.forEach((ne) => yo(ne, V));
                }),
                y.forEach((x) => {
                  this.processLeaveNode(x);
                });
            });
          const te = [],
            se = [];
          for (let x = this._namespaceList.length - 1; x >= 0; x--)
            this._namespaceList[x].drainQueuedTransitions(e).forEach((V) => {
              const ne = V.player,
                Ke = V.element;
              if ((te.push(ne), this.collectedEnterElements.length)) {
                const ct = Ke[Zt];
                if (ct && ct.setForMove) {
                  if (
                    ct.previousTriggersValues &&
                    ct.previousTriggersValues.has(V.triggerName)
                  ) {
                    const oi = ct.previousTriggersValues.get(V.triggerName),
                      Jt = this.statesByElement.get(V.element);
                    if (Jt && Jt.has(V.triggerName)) {
                      const $u = Jt.get(V.triggerName);
                      ($u.value = oi), Jt.set(V.triggerName, $u);
                    }
                  }
                  return void ne.destroy();
                }
              }
              const Rn = !d || !this.driver.containsElement(d, Ke),
                Vt = _.get(Ke),
                Ar = p.get(Ke),
                Fe = this._buildInstruction(V, r, Ar, Vt, Rn);
              if (Fe.errors && Fe.errors.length) return void se.push(Fe);
              if (Rn)
                return (
                  ne.onStart(() => ni(Ke, Fe.fromStyles)),
                  ne.onDestroy(() => xn(Ke, Fe.toStyles)),
                  void i.push(ne)
                );
              if (V.isFallbackTransition)
                return (
                  ne.onStart(() => ni(Ke, Fe.fromStyles)),
                  ne.onDestroy(() => xn(Ke, Fe.toStyles)),
                  void i.push(ne)
                );
              const $M = [];
              Fe.timelines.forEach((ct) => {
                (ct.stretchStartingKeyframe = !0),
                  this.disabledNodes.has(ct.element) || $M.push(ct);
              }),
                (Fe.timelines = $M),
                r.append(Ke, Fe.timelines),
                s.push({ instruction: Fe, player: ne, element: Ke }),
                Fe.queriedElements.forEach((ct) => Pt(a, ct, []).push(ne)),
                Fe.preStyleProps.forEach((ct, oi) => {
                  if (ct.size) {
                    let Jt = l.get(oi);
                    Jt || l.set(oi, (Jt = new Set())),
                      ct.forEach(($u, Ip) => Jt.add(Ip));
                  }
                }),
                Fe.postStyleProps.forEach((ct, oi) => {
                  let Jt = u.get(oi);
                  Jt || u.set(oi, (Jt = new Set())),
                    ct.forEach(($u, Ip) => Jt.add(Ip));
                });
            });
          if (se.length) {
            const x = [];
            se.forEach((N) => {
              x.push(
                (function pj(n, t) {
                  return new b(3505, !1);
                })()
              );
            }),
              te.forEach((N) => N.destroy()),
              this.reportError(x);
          }
          const ut = new Map(),
            Jn = new Map();
          s.forEach((x) => {
            const N = x.element;
            r.has(N) &&
              (Jn.set(N, N),
              this._beforeAnimationBuild(
                x.player.namespaceId,
                x.instruction,
                ut
              ));
          }),
            i.forEach((x) => {
              const N = x.element;
              this._getPreviousPlayers(
                N,
                !1,
                x.namespaceId,
                x.triggerName,
                null
              ).forEach((ne) => {
                Pt(ut, N, []).push(ne), ne.destroy();
              });
            });
          const er = y.filter((x) => NM(x, l, u)),
            tr = new Map();
          FM(tr, this.driver, E, u, Wn).forEach((x) => {
            NM(x, l, u) && er.push(x);
          });
          const Xs = new Map();
          f.forEach((x, N) => {
            FM(Xs, this.driver, new Set(x), l, "!");
          }),
            er.forEach((x) => {
              const N = tr.get(x),
                V = Xs.get(x);
              tr.set(
                x,
                new Map([
                  ...Array.from(N?.entries() ?? []),
                  ...Array.from(V?.entries() ?? []),
                ])
              );
            });
          const ii = [],
            UM = [],
            jM = {};
          s.forEach((x) => {
            const { element: N, player: V, instruction: ne } = x;
            if (r.has(N)) {
              if (c.has(N))
                return (
                  V.onDestroy(() => xn(N, ne.toStyles)),
                  (V.disabled = !0),
                  V.overrideTotalTime(ne.totalTime),
                  void i.push(V)
                );
              let Ke = jM;
              if (Jn.size > 1) {
                let Vt = N;
                const Ar = [];
                for (; (Vt = Vt.parentNode); ) {
                  const Fe = Jn.get(Vt);
                  if (Fe) {
                    Ke = Fe;
                    break;
                  }
                  Ar.push(Vt);
                }
                Ar.forEach((Fe) => Jn.set(Fe, Ke));
              }
              const Rn = this._buildAnimation(V.namespaceId, ne, ut, o, Xs, tr);
              if ((V.setRealPlayer(Rn), Ke === jM)) ii.push(V);
              else {
                const Vt = this.playersByElement.get(Ke);
                Vt && Vt.length && (V.parentPlayer = Mr(Vt)), i.push(V);
              }
            } else
              ni(N, ne.fromStyles),
                V.onDestroy(() => xn(N, ne.toStyles)),
                UM.push(V),
                c.has(N) && i.push(V);
          }),
            UM.forEach((x) => {
              const N = o.get(x.element);
              if (N && N.length) {
                const V = Mr(N);
                x.setRealPlayer(V);
              }
            }),
            i.forEach((x) => {
              x.parentPlayer ? x.syncPlayerEvents(x.parentPlayer) : x.destroy();
            });
          for (let x = 0; x < y.length; x++) {
            const N = y[x],
              V = N[Zt];
            if ((yo(N, Au), V && V.hasAnimation)) continue;
            let ne = [];
            if (a.size) {
              let Rn = a.get(N);
              Rn && Rn.length && ne.push(...Rn);
              let Vt = this.driver.query(N, dp, !0);
              for (let Ar = 0; Ar < Vt.length; Ar++) {
                let Fe = a.get(Vt[Ar]);
                Fe && Fe.length && ne.push(...Fe);
              }
            }
            const Ke = ne.filter((Rn) => !Rn.destroyed);
            Ke.length ? y$(this, N, Ke) : this.processLeaveNode(N);
          }
          return (
            (y.length = 0),
            ii.forEach((x) => {
              this.players.push(x),
                x.onDone(() => {
                  x.destroy();
                  const N = this.players.indexOf(x);
                  this.players.splice(N, 1);
                }),
                x.play();
            }),
            ii
          );
        }
        elementContainsData(t, e) {
          let r = !1;
          const i = e[Zt];
          return (
            i && i.setForRemoval && (r = !0),
            this.playersByElement.has(e) && (r = !0),
            this.playersByQueriedElement.has(e) && (r = !0),
            this.statesByElement.has(e) && (r = !0),
            this._fetchNamespace(t).elementContainsData(e) || r
          );
        }
        afterFlush(t) {
          this._flushFns.push(t);
        }
        afterFlushAnimationsDone(t) {
          this._whenQuietFns.push(t);
        }
        _getPreviousPlayers(t, e, r, i, o) {
          let s = [];
          if (e) {
            const a = this.playersByQueriedElement.get(t);
            a && (s = a);
          } else {
            const a = this.playersByElement.get(t);
            if (a) {
              const l = !o || o == Zs;
              a.forEach((u) => {
                u.queued || (!l && u.triggerName != i) || s.push(u);
              });
            }
          }
          return (
            (r || i) &&
              (s = s.filter(
                (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName))
              )),
            s
          );
        }
        _beforeAnimationBuild(t, e, r) {
          const o = e.element,
            s = e.isRemovalTransition ? void 0 : t,
            a = e.isRemovalTransition ? void 0 : e.triggerName;
          for (const l of e.timelines) {
            const u = l.element,
              c = u !== o,
              d = Pt(r, u, []);
            this._getPreviousPlayers(u, c, s, a, e.toState).forEach((f) => {
              const p = f.getRealPlayer();
              p.beforeDestroy && p.beforeDestroy(), f.destroy(), d.push(f);
            });
          }
          ni(o, e.fromStyles);
        }
        _buildAnimation(t, e, r, i, o, s) {
          const a = e.triggerName,
            l = e.element,
            u = [],
            c = new Set(),
            d = new Set(),
            h = e.timelines.map((p) => {
              const m = p.element;
              c.add(m);
              const y = m[Zt];
              if (y && y.removedBeforeQueried)
                return new Es(p.duration, p.delay);
              const D = m !== l,
                E = (function _$(n) {
                  const t = [];
                  return RM(n, t), t;
                })((r.get(m) || c$).map((ut) => ut.getRealPlayer())).filter(
                  (ut) => !!ut.element && ut.element === m
                ),
                _ = o.get(m),
                F = s.get(m),
                te = iM(0, this._normalizer, 0, p.keyframes, _, F),
                se = this._buildPlayer(p, te, E);
              if ((p.subTimeline && i && d.add(m), D)) {
                const ut = new Mp(t, a, m);
                ut.setRealPlayer(se), u.push(ut);
              }
              return se;
            });
          u.forEach((p) => {
            Pt(this.playersByQueriedElement, p.element, []).push(p),
              p.onDone(() =>
                (function p$(n, t, e) {
                  let r = n.get(t);
                  if (r) {
                    if (r.length) {
                      const i = r.indexOf(e);
                      r.splice(i, 1);
                    }
                    0 == r.length && n.delete(t);
                  }
                  return r;
                })(this.playersByQueriedElement, p.element, p)
              );
          }),
            c.forEach((p) => Xt(p, fM));
          const f = Mr(h);
          return (
            f.onDestroy(() => {
              c.forEach((p) => yo(p, fM)), xn(l, e.toStyles);
            }),
            d.forEach((p) => {
              Pt(i, p, []).push(f);
            }),
            f
          );
        }
        _buildPlayer(t, e, r) {
          return e.length > 0
            ? this.driver.animate(
                t.element,
                e,
                t.duration,
                t.delay,
                t.easing,
                r
              )
            : new Es(t.duration, t.delay);
        }
      }
      class Mp {
        constructor(t, e, r) {
          (this.namespaceId = t),
            (this.triggerName = e),
            (this.element = r),
            (this._player = new Es()),
            (this._containsRealPlayer = !1),
            (this._queuedCallbacks = new Map()),
            (this.destroyed = !1),
            (this.markedForDestroy = !1),
            (this.disabled = !1),
            (this.queued = !0),
            (this.totalTime = 0);
        }
        setRealPlayer(t) {
          this._containsRealPlayer ||
            ((this._player = t),
            this._queuedCallbacks.forEach((e, r) => {
              e.forEach((i) => ip(t, r, void 0, i));
            }),
            this._queuedCallbacks.clear(),
            (this._containsRealPlayer = !0),
            this.overrideTotalTime(t.totalTime),
            (this.queued = !1));
        }
        getRealPlayer() {
          return this._player;
        }
        overrideTotalTime(t) {
          this.totalTime = t;
        }
        syncPlayerEvents(t) {
          const e = this._player;
          e.triggerCallback && t.onStart(() => e.triggerCallback("start")),
            t.onDone(() => this.finish()),
            t.onDestroy(() => this.destroy());
        }
        _queueEvent(t, e) {
          Pt(this._queuedCallbacks, t, []).push(e);
        }
        onDone(t) {
          this.queued && this._queueEvent("done", t), this._player.onDone(t);
        }
        onStart(t) {
          this.queued && this._queueEvent("start", t), this._player.onStart(t);
        }
        onDestroy(t) {
          this.queued && this._queueEvent("destroy", t),
            this._player.onDestroy(t);
        }
        init() {
          this._player.init();
        }
        hasStarted() {
          return !this.queued && this._player.hasStarted();
        }
        play() {
          !this.queued && this._player.play();
        }
        pause() {
          !this.queued && this._player.pause();
        }
        restart() {
          !this.queued && this._player.restart();
        }
        finish() {
          this._player.finish();
        }
        destroy() {
          (this.destroyed = !0), this._player.destroy();
        }
        reset() {
          !this.queued && this._player.reset();
        }
        setPosition(t) {
          this.queued || this._player.setPosition(t);
        }
        getPosition() {
          return this.queued ? 0 : this._player.getPosition();
        }
        triggerCallback(t) {
          const e = this._player;
          e.triggerCallback && e.triggerCallback(t);
        }
      }
      function Hu(n) {
        return n && 1 === n.nodeType;
      }
      function TM(n, t) {
        const e = n.style.display;
        return (n.style.display = t ?? "none"), e;
      }
      function FM(n, t, e, r, i) {
        const o = [];
        e.forEach((l) => o.push(TM(l)));
        const s = [];
        r.forEach((l, u) => {
          const c = new Map();
          l.forEach((d) => {
            const h = t.computeStyle(u, d, i);
            c.set(d, h), (!h || 0 == h.length) && ((u[Zt] = d$), s.push(u));
          }),
            n.set(u, c);
        });
        let a = 0;
        return e.forEach((l) => TM(l, o[a++])), s;
      }
      function xM(n, t) {
        const e = new Map();
        if ((n.forEach((a) => e.set(a, [])), 0 == t.length)) return e;
        const i = new Set(t),
          o = new Map();
        function s(a) {
          if (!a) return 1;
          let l = o.get(a);
          if (l) return l;
          const u = a.parentNode;
          return (l = e.has(u) ? u : i.has(u) ? 1 : s(u)), o.set(a, l), l;
        }
        return (
          t.forEach((a) => {
            const l = s(a);
            1 !== l && e.get(l).push(a);
          }),
          e
        );
      }
      function Xt(n, t) {
        n.classList?.add(t);
      }
      function yo(n, t) {
        n.classList?.remove(t);
      }
      function y$(n, t, e) {
        Mr(e).onDone(() => n.processLeaveNode(t));
      }
      function RM(n, t) {
        for (let e = 0; e < n.length; e++) {
          const r = n[e];
          r instanceof dD ? RM(r.players, t) : t.push(r);
        }
      }
      function NM(n, t, e) {
        const r = e.get(n);
        if (!r) return !1;
        let i = t.get(n);
        return i ? r.forEach((o) => i.add(o)) : t.set(n, r), e.delete(n), !0;
      }
      class Uu {
        constructor(t, e, r) {
          (this.bodyNode = t),
            (this._driver = e),
            (this._normalizer = r),
            (this._triggerCache = {}),
            (this.onRemovalComplete = (i, o) => {}),
            (this._transitionEngine = new f$(t, e, r)),
            (this._timelineEngine = new o$(t, e, r)),
            (this._transitionEngine.onRemovalComplete = (i, o) =>
              this.onRemovalComplete(i, o));
        }
        registerTrigger(t, e, r, i, o) {
          const s = t + "-" + i;
          let a = this._triggerCache[s];
          if (!a) {
            const l = [],
              c = mp(this._driver, o, l, []);
            if (l.length)
              throw (function rj(n, t) {
                return new b(3404, !1);
              })();
            (a = (function t$(n, t, e) {
              return new n$(n, t, e);
            })(i, c, this._normalizer)),
              (this._triggerCache[s] = a);
          }
          this._transitionEngine.registerTrigger(e, i, a);
        }
        register(t, e) {
          this._transitionEngine.register(t, e);
        }
        destroy(t, e) {
          this._transitionEngine.destroy(t, e);
        }
        onInsert(t, e, r, i) {
          this._transitionEngine.insertNode(t, e, r, i);
        }
        onRemove(t, e, r, i) {
          this._transitionEngine.removeNode(t, e, i || !1, r);
        }
        disableAnimations(t, e) {
          this._transitionEngine.markElementAsDisabled(t, e);
        }
        process(t, e, r, i) {
          if ("@" == r.charAt(0)) {
            const [o, s] = oM(r);
            this._timelineEngine.command(o, e, s, i);
          } else this._transitionEngine.trigger(t, e, r, i);
        }
        listen(t, e, r, i, o) {
          if ("@" == r.charAt(0)) {
            const [s, a] = oM(r);
            return this._timelineEngine.listen(s, e, a, o);
          }
          return this._transitionEngine.listen(t, e, r, i, o);
        }
        flush(t = -1) {
          this._transitionEngine.flush(t);
        }
        get players() {
          return this._transitionEngine.players.concat(
            this._timelineEngine.players
          );
        }
        whenRenderingDone() {
          return this._transitionEngine.whenRenderingDone();
        }
      }
      let C$ = (() => {
        class n {
          constructor(e, r, i) {
            (this._element = e),
              (this._startStyles = r),
              (this._endStyles = i),
              (this._state = 0);
            let o = n.initialStylesByElement.get(e);
            o || n.initialStylesByElement.set(e, (o = new Map())),
              (this._initialStyles = o);
          }
          start() {
            this._state < 1 &&
              (this._startStyles &&
                xn(this._element, this._startStyles, this._initialStyles),
              (this._state = 1));
          }
          finish() {
            this.start(),
              this._state < 2 &&
                (xn(this._element, this._initialStyles),
                this._endStyles &&
                  (xn(this._element, this._endStyles),
                  (this._endStyles = null)),
                (this._state = 1));
          }
          destroy() {
            this.finish(),
              this._state < 3 &&
                (n.initialStylesByElement.delete(this._element),
                this._startStyles &&
                  (ni(this._element, this._startStyles),
                  (this._endStyles = null)),
                this._endStyles &&
                  (ni(this._element, this._endStyles),
                  (this._endStyles = null)),
                xn(this._element, this._initialStyles),
                (this._state = 3));
          }
        }
        return (n.initialStylesByElement = new WeakMap()), n;
      })();
      function Sp(n) {
        let t = null;
        return (
          n.forEach((e, r) => {
            (function D$(n) {
              return "display" === n || "position" === n;
            })(r) && ((t = t || new Map()), t.set(r, e));
          }),
          t
        );
      }
      class kM {
        constructor(t, e, r, i) {
          (this.element = t),
            (this.keyframes = e),
            (this.options = r),
            (this._specialStyles = i),
            (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._initialized = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this.time = 0),
            (this.parentPlayer = null),
            (this.currentSnapshot = new Map()),
            (this._duration = r.duration),
            (this._delay = r.delay || 0),
            (this.time = this._duration + this._delay);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        init() {
          this._buildPlayer(), this._preparePlayerBeforeStart();
        }
        _buildPlayer() {
          if (this._initialized) return;
          this._initialized = !0;
          const t = this.keyframes;
          (this.domPlayer = this._triggerWebAnimation(
            this.element,
            t,
            this.options
          )),
            (this._finalKeyframe = t.length ? t[t.length - 1] : new Map()),
            this.domPlayer.addEventListener("finish", () => this._onFinish());
        }
        _preparePlayerBeforeStart() {
          this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
        }
        _convertKeyframesToObject(t) {
          const e = [];
          return (
            t.forEach((r) => {
              e.push(Object.fromEntries(r));
            }),
            e
          );
        }
        _triggerWebAnimation(t, e, r) {
          return t.animate(this._convertKeyframesToObject(e), r);
        }
        onStart(t) {
          this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
          this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        play() {
          this._buildPlayer(),
            this.hasStarted() ||
              (this._onStartFns.forEach((t) => t()),
              (this._onStartFns = []),
              (this._started = !0),
              this._specialStyles && this._specialStyles.start()),
            this.domPlayer.play();
        }
        pause() {
          this.init(), this.domPlayer.pause();
        }
        finish() {
          this.init(),
            this._specialStyles && this._specialStyles.finish(),
            this._onFinish(),
            this.domPlayer.finish();
        }
        reset() {
          this._resetDomPlayerState(),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        _resetDomPlayerState() {
          this.domPlayer && this.domPlayer.cancel();
        }
        restart() {
          this.reset(), this.play();
        }
        hasStarted() {
          return this._started;
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._resetDomPlayerState(),
            this._onFinish(),
            this._specialStyles && this._specialStyles.destroy(),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        setPosition(t) {
          void 0 === this.domPlayer && this.init(),
            (this.domPlayer.currentTime = t * this.time);
        }
        getPosition() {
          return this.domPlayer.currentTime / this.time;
        }
        get totalTime() {
          return this._delay + this._duration;
        }
        beforeDestroy() {
          const t = new Map();
          this.hasStarted() &&
            this._finalKeyframe.forEach((r, i) => {
              "offset" !== i &&
                t.set(i, this._finished ? r : vM(this.element, i));
            }),
            (this.currentSnapshot = t);
        }
        triggerCallback(t) {
          const e = "start" === t ? this._onStartFns : this._onDoneFns;
          e.forEach((r) => r()), (e.length = 0);
        }
      }
      class E$ {
        validateStyleProperty(t) {
          return !0;
        }
        validateAnimatableStyleProperty(t) {
          return !0;
        }
        matchesElement(t, e) {
          return !1;
        }
        containsElement(t, e) {
          return uM(t, e);
        }
        getParentElement(t) {
          return lp(t);
        }
        query(t, e, r) {
          return cM(t, e, r);
        }
        computeStyle(t, e, r) {
          return window.getComputedStyle(t)[e];
        }
        animate(t, e, r, i, o, s = []) {
          const l = {
            duration: r,
            delay: i,
            fill: 0 == i ? "both" : "forwards",
          };
          o && (l.easing = o);
          const u = new Map(),
            c = s.filter((f) => f instanceof kM);
          (function Aj(n, t) {
            return 0 === n || 0 === t;
          })(r, i) &&
            c.forEach((f) => {
              f.currentSnapshot.forEach((p, m) => u.set(m, p));
            });
          let d = (function Ej(n) {
            return n.length
              ? n[0] instanceof Map
                ? n
                : n.map((t) => pM(t))
              : [];
          })(e).map((f) => Sr(f));
          d = (function Ij(n, t, e) {
            if (e.size && t.length) {
              let r = t[0],
                i = [];
              if (
                (e.forEach((o, s) => {
                  r.has(s) || i.push(s), r.set(s, o);
                }),
                i.length)
              )
                for (let o = 1; o < t.length; o++) {
                  let s = t[o];
                  i.forEach((a) => s.set(a, vM(n, a)));
                }
            }
            return t;
          })(t, d, u);
          const h = (function b$(n, t) {
            let e = null,
              r = null;
            return (
              Array.isArray(t) && t.length
                ? ((e = Sp(t[0])), t.length > 1 && (r = Sp(t[t.length - 1])))
                : t instanceof Map && (e = Sp(t)),
              e || r ? new C$(n, e, r) : null
            );
          })(t, d);
          return new kM(t, d, l, h);
        }
      }
      let w$ = (() => {
        class n extends lD {
          constructor(e, r) {
            super(),
              (this._nextAnimationId = 0),
              (this._renderer = e.createRenderer(r.body, {
                id: "0",
                encapsulation: tn.None,
                styles: [],
                data: { animation: [] },
              }));
          }
          build(e) {
            const r = this._nextAnimationId.toString();
            this._nextAnimationId++;
            const i = Array.isArray(e) ? uD(e) : e;
            return (
              OM(this._renderer, null, r, "register", [i]),
              new M$(r, this._renderer)
            );
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(qo), v(J));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class M$ extends gL {
        constructor(t, e) {
          super(), (this._id = t), (this._renderer = e);
        }
        create(t, e) {
          return new S$(this._id, t, e || {}, this._renderer);
        }
      }
      class S$ {
        constructor(t, e, r, i) {
          (this.id = t),
            (this.element = e),
            (this._renderer = i),
            (this.parentPlayer = null),
            (this._started = !1),
            (this.totalTime = 0),
            this._command("create", r);
        }
        _listen(t, e) {
          return this._renderer.listen(this.element, `@@${this.id}:${t}`, e);
        }
        _command(t, ...e) {
          return OM(this._renderer, this.element, this.id, t, e);
        }
        onDone(t) {
          this._listen("done", t);
        }
        onStart(t) {
          this._listen("start", t);
        }
        onDestroy(t) {
          this._listen("destroy", t);
        }
        init() {
          this._command("init");
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this._command("play"), (this._started = !0);
        }
        pause() {
          this._command("pause");
        }
        restart() {
          this._command("restart");
        }
        finish() {
          this._command("finish");
        }
        destroy() {
          this._command("destroy");
        }
        reset() {
          this._command("reset"), (this._started = !1);
        }
        setPosition(t) {
          this._command("setPosition", t);
        }
        getPosition() {
          return this._renderer.engine.players[+this.id]?.getPosition() ?? 0;
        }
      }
      function OM(n, t, e, r, i) {
        return n.setProperty(t, `@@${e}:${r}`, i);
      }
      const PM = "@.disabled";
      let A$ = (() => {
        class n {
          constructor(e, r, i) {
            (this.delegate = e),
              (this.engine = r),
              (this._zone = i),
              (this._currentId = 0),
              (this._microtaskId = 1),
              (this._animationCallbacksBuffer = []),
              (this._rendererCache = new Map()),
              (this._cdRecurDepth = 0),
              (this.promise = Promise.resolve(0)),
              (r.onRemovalComplete = (o, s) => {
                const a = s?.parentNode(o);
                a && s.removeChild(a, o);
              });
          }
          createRenderer(e, r) {
            const o = this.delegate.createRenderer(e, r);
            if (!(e && r && r.data && r.data.animation)) {
              let c = this._rendererCache.get(o);
              return (
                c ||
                  ((c = new LM("", o, this.engine, () =>
                    this._rendererCache.delete(o)
                  )),
                  this._rendererCache.set(o, c)),
                c
              );
            }
            const s = r.id,
              a = r.id + "-" + this._currentId;
            this._currentId++, this.engine.register(a, e);
            const l = (c) => {
              Array.isArray(c)
                ? c.forEach(l)
                : this.engine.registerTrigger(s, a, e, c.name, c);
            };
            return r.data.animation.forEach(l), new I$(this, a, o, this.engine);
          }
          begin() {
            this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
          }
          _scheduleCountTask() {
            this.promise.then(() => {
              this._microtaskId++;
            });
          }
          scheduleListenerCallback(e, r, i) {
            e >= 0 && e < this._microtaskId
              ? this._zone.run(() => r(i))
              : (0 == this._animationCallbacksBuffer.length &&
                  Promise.resolve(null).then(() => {
                    this._zone.run(() => {
                      this._animationCallbacksBuffer.forEach((o) => {
                        const [s, a] = o;
                        s(a);
                      }),
                        (this._animationCallbacksBuffer = []);
                    });
                  }),
                this._animationCallbacksBuffer.push([r, i]));
          }
          end() {
            this._cdRecurDepth--,
              0 == this._cdRecurDepth &&
                this._zone.runOutsideAngular(() => {
                  this._scheduleCountTask(),
                    this.engine.flush(this._microtaskId);
                }),
              this.delegate.end && this.delegate.end();
          }
          whenRenderingDone() {
            return this.engine.whenRenderingDone();
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(qo), v(Uu), v(K));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      class LM {
        constructor(t, e, r, i) {
          (this.namespaceId = t),
            (this.delegate = e),
            (this.engine = r),
            (this._onDestroy = i),
            (this.destroyNode = this.delegate.destroyNode
              ? (o) => e.destroyNode(o)
              : null);
        }
        get data() {
          return this.delegate.data;
        }
        destroy() {
          this.engine.destroy(this.namespaceId, this.delegate),
            this.delegate.destroy(),
            this._onDestroy?.();
        }
        createElement(t, e) {
          return this.delegate.createElement(t, e);
        }
        createComment(t) {
          return this.delegate.createComment(t);
        }
        createText(t) {
          return this.delegate.createText(t);
        }
        appendChild(t, e) {
          this.delegate.appendChild(t, e),
            this.engine.onInsert(this.namespaceId, e, t, !1);
        }
        insertBefore(t, e, r, i = !0) {
          this.delegate.insertBefore(t, e, r),
            this.engine.onInsert(this.namespaceId, e, t, i);
        }
        removeChild(t, e, r) {
          this.engine.onRemove(this.namespaceId, e, this.delegate, r);
        }
        selectRootElement(t, e) {
          return this.delegate.selectRootElement(t, e);
        }
        parentNode(t) {
          return this.delegate.parentNode(t);
        }
        nextSibling(t) {
          return this.delegate.nextSibling(t);
        }
        setAttribute(t, e, r, i) {
          this.delegate.setAttribute(t, e, r, i);
        }
        removeAttribute(t, e, r) {
          this.delegate.removeAttribute(t, e, r);
        }
        addClass(t, e) {
          this.delegate.addClass(t, e);
        }
        removeClass(t, e) {
          this.delegate.removeClass(t, e);
        }
        setStyle(t, e, r, i) {
          this.delegate.setStyle(t, e, r, i);
        }
        removeStyle(t, e, r) {
          this.delegate.removeStyle(t, e, r);
        }
        setProperty(t, e, r) {
          "@" == e.charAt(0) && e == PM
            ? this.disableAnimations(t, !!r)
            : this.delegate.setProperty(t, e, r);
        }
        setValue(t, e) {
          this.delegate.setValue(t, e);
        }
        listen(t, e, r) {
          return this.delegate.listen(t, e, r);
        }
        disableAnimations(t, e) {
          this.engine.disableAnimations(t, e);
        }
      }
      class I$ extends LM {
        constructor(t, e, r, i, o) {
          super(e, r, i, o), (this.factory = t), (this.namespaceId = e);
        }
        setProperty(t, e, r) {
          "@" == e.charAt(0)
            ? "." == e.charAt(1) && e == PM
              ? this.disableAnimations(t, (r = void 0 === r || !!r))
              : this.engine.process(this.namespaceId, t, e.slice(1), r)
            : this.delegate.setProperty(t, e, r);
        }
        listen(t, e, r) {
          if ("@" == e.charAt(0)) {
            const i = (function T$(n) {
              switch (n) {
                case "body":
                  return document.body;
                case "document":
                  return document;
                case "window":
                  return window;
                default:
                  return n;
              }
            })(t);
            let o = e.slice(1),
              s = "";
            return (
              "@" != o.charAt(0) &&
                ([o, s] = (function F$(n) {
                  const t = n.indexOf(".");
                  return [n.substring(0, t), n.slice(t + 1)];
                })(o)),
              this.engine.listen(this.namespaceId, i, o, s, (a) => {
                this.factory.scheduleListenerCallback(a._data || -1, r, a);
              })
            );
          }
          return this.delegate.listen(t, e, r);
        }
      }
      let x$ = (() => {
        class n extends Uu {
          constructor(e, r, i, o) {
            super(e.body, r, i);
          }
          ngOnDestroy() {
            this.flush();
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)(v(J), v(up), v(bp), v(hs));
          }),
          (n.ɵprov = I({ token: n, factory: n.ɵfac })),
          n
        );
      })();
      const VM = [
          { provide: lD, useClass: w$ },
          {
            provide: bp,
            useFactory: function R$() {
              return new Zj();
            },
          },
          { provide: Uu, useClass: x$ },
          {
            provide: qo,
            useFactory: function N$(n, t, e) {
              return new A$(n, t, e);
            },
            deps: [xl, Uu, K],
          },
        ],
        Ap = [
          { provide: up, useFactory: () => new E$() },
          { provide: cr, useValue: "BrowserAnimations" },
          ...VM,
        ],
        BM = [
          { provide: up, useClass: dM },
          { provide: cr, useValue: "NoopAnimations" },
          ...VM,
        ];
      let k$ = (() => {
        class n {
          static withConfig(e) {
            return { ngModule: n, providers: e.disableAnimations ? BM : Ap };
          }
        }
        return (
          (n.ɵfac = function (e) {
            return new (e || n)();
          }),
          (n.ɵmod = me({ type: n })),
          (n.ɵinj = de({ providers: Ap, imports: [mC] })),
          n
        );
      })();
      class _o {}
      (_o.ɵfac = function (t) {
        return new (t || _o)();
      }),
        (_o.ɵmod = me({ type: _o, bootstrap: [Ws] })),
        (_o.ɵinj = de({ imports: [mC, mo, k$, iL, eB, nf, WV, HB, qV, zB] })),
        o1()
          .bootstrapModule(_o)
          .catch((n) => console.error(n));
    },
  },
  (nr) => {
    nr((nr.s = 17));
  },
]);
