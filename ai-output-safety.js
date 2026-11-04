'use strict';

// Never expose provider reasoning, transcript delimiters or internal channels to learners.
// Fail closed: rejecting a contaminated result is safer than trying to redact pieces.
const MARKERS = [
  /(?:^|[\r\n])\s*analysis\s*:/i,
  /\bassistant\s*(?:final|analysis)\s*:/i,
  /<\/?(?:think|thinking|analysis|reasoning)\s*>/i,
  /<\|(?:im_start|im_sep|start_header_id|end_header_id|eot_id|channel)\|>/i,
  /\[\s*(?:internal reasoning|chain of thought)\s*\]/i
];

function hasInternalReasoningLeak(value) {
  const text = String(value == null ? '' : value);
  return MARKERS.some(pattern => pattern.test(text));
}

module.exports = { hasInternalReasoningLeak };
