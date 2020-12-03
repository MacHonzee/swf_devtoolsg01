const { Uu5String } = require("uu5stringg01");

const Uu5StringHelper = {
  findComponent(uu5string, tagName) {
    // with the power of closure, component shall be found!
    let component = null;
    function findComponentBuildFn(tag, propsString, children, isPairedTag, initFn, parent) {
      if (!tag) return children;
      let uu5StringObject = new Uu5String.Object(tag, propsString, children, isPairedTag, initFn, parent);
      if (tag === tagName) {
        component = uu5StringObject;
      }
      return uu5StringObject;
    }

    Uu5String.parse(uu5string, { buildItemFn: findComponentBuildFn });
    return component;
  },

  findComponentInPage(page, tagName) {
    let foundComponent;
    for (let section of page.body) {
      // first we check whole uu5string if the tag is present inside the plain string
      if (section.content.includes(tagName)) {
        // if we know the tag is there, we parse the uu5string into objects
        foundComponent = Uu5StringHelper.findComponent(section.content, tagName);
        break;
      }
    }
    return foundComponent;
  },
};

module.exports = Uu5StringHelper;
