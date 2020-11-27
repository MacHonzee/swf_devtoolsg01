const Uu5StringHelper = require("./uu5string-helper");

const TagName = "UuApp.DesignKit.Algorithm";

const ErrorReplacement = /{errorCode}/;

function forEachStatement(step, cb) {
  let statementList = step.statementList || [];
  statementList.forEach((statement) => {
    cb(statement);
    forEachStatement(statement, cb);
  });
}

const Uu5AlgorithmHelper = {
  findInPage(pageData) {
    return Uu5StringHelper.findComponentInPage(pageData, TagName);
  },

  getErrorsOrWarnings(algorithm, type) {
    let algData = algorithm.props.toObject().data;
    let errMap = {};
    let errPrefix = algData.errorPrefix.replace(ErrorReplacement, "");
    if (!errPrefix.endsWith("/")) errPrefix += "/";
    forEachStatement(algData, (step) => {
      if (step.type === type) {
        let errCode = errPrefix + step.code;
        errMap[errCode] = step.message;
      }
    });
    return errMap;
  },
};

module.exports = Uu5AlgorithmHelper;
