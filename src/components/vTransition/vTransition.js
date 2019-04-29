// 垂直方向上展开和收起
// let duration = '1s';
// let delay = '0.3s';
// const vTransition =
//   duration +
//   ' height ease-in-out,' +
//   duration +
//   ' padding-top ease-in-out, ' +
//   duration +
//   ' padding-bottom ease-in-out';
// const Transition = {
//   'before-enter'(el) {
//     el.style.transition = vTransition;
//     if (!el.dataset) el.dataset = {};

//     el.dataset.oldPaddingTop = el.style.paddingTop;
//     el.dataset.oldPaddingBottom = el.style.paddingBottom;

//     el.style.height = 0;
//     el.style.paddingTop = 0;
//     el.style.paddingBottom = 0;
//   },

//   enter(el) {
//     el.dataset.oldOverflow = el.style.overflow;
//     if (el.scrollHeight !== 0) {
//       el.style.height = el.scrollHeight + 'px';
//       el.style.paddingTop = el.dataset.oldPaddingTop;
//       el.style.paddingBottom = el.dataset.oldPaddingBottom;
//     } else {
//       el.style.height = '';
//       el.style.paddingTop = el.dataset.oldPaddingTop;
//       el.style.paddingBottom = el.dataset.oldPaddingBottom;
//     }

//     el.style.overflow = 'hidden';
//   },

//   'after-enter'(el) {
//     el.style.transition = '';
//     el.style.height = '';
//     el.style.overflow = el.dataset.oldOverflow;
//   },

//   'before-leave'(el) {
//     if (!el.dataset) el.dataset = {};
//     el.dataset.oldPaddingTop = el.style.paddingTop;
//     el.dataset.oldPaddingBottom = el.style.paddingBottom;
//     el.dataset.oldOverflow = el.style.overflow;

//     el.style.height = el.scrollHeight + 'px';
//     el.style.overflow = 'hidden';
//   },

//   leave(el) {
//     if (el.scrollHeight !== 0) {
//       el.style.transition = vTransition;
//       el.style.height = 0;
//       el.style.paddingTop = 0;
//       el.style.paddingBottom = 0;
//     }
//   },

//   'after-leave'(el) {
//     el.style.transition = '';
//     el.style.height = '';
//     el.style.overflow = el.dataset.oldOverflow;
//     el.style.paddingTop = el.dataset.oldPaddingTop;
//     el.style.paddingBottom = el.dataset.oldPaddingBottom;
//   }
// };

function vTransition(props) {
  let vTransitionStr =
    props.duration +
    ' height ease-in-out,' +
    props.duration +
    ' padding-top ease-in-out, ' +
    props.duration +
    ' padding-bottom ease-in-out';
  return {
    'before-enter'(el) {
      el.style.transition = vTransitionStr;
      if (!el.dataset) el.dataset = {};

      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;

      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    },

    enter(el) {
      el.dataset.oldOverflow = el.style.overflow;
      if (el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + 'px';
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      } else {
        el.style.height = '';
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      }

      el.style.overflow = 'hidden';
    },

    'after-enter'(el) {
      el.style.transition = '';
      el.style.height = '';
      el.style.overflow = el.dataset.oldOverflow;
    },

    'before-leave'(el) {
      if (!el.dataset) el.dataset = {};
      el.dataset.oldPaddingTop = el.style.paddingTop;
      el.dataset.oldPaddingBottom = el.style.paddingBottom;
      el.dataset.oldOverflow = el.style.overflow;

      el.style.height = el.scrollHeight + 'px';
      el.style.overflow = 'hidden';
    },

    leave(el) {
      if (el.scrollHeight !== 0) {
        el.style.transition = vTransitionStr;
        el.style.height = 0;
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;
      }
    },

    'after-leave'(el) {
      el.style.transition = '';
      el.style.height = '';
      el.style.overflow = el.dataset.oldOverflow;
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }
  };
}
export default {
  name: 'collapseTransition',
  functional: true,
  props: {
    duration: {
      type: String,
      default: '1s'
    }
  },
  render(h, { children, props }) {
    const data = {
      on: vTransition(props)
    };
    return h('transition', data, children);
  }
};
