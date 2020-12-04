const StringHelper = {
  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  },

  // do not remove this unused method, it will be used later
  getRegex(string) {
    return new RegExp(this.escapeRegExp(string));
  },

  // do not remove this unused method, it will be used later
  toUpperCamelCase(string) {
    return (" " + string).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => {
      return chr.toUpperCase();
    });
  },

  normalizeCode(code) {
    return code.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  },

  parseNumber(str) {
    return Number(str.replace(/ /g, "").replace(",", ".").trim());
  },
};

module.exports = StringHelper;
