(function() {

    /**
     * Gets the value at path of object.
     *
     * If the resolved value is undefined, the defaultValue is returned in its place.
     * Simplified version of https://lodash.com/docs/4.17.15#get
     *
     *     var App = { 'a': { 'b': { 'c': 3 } } };
     *     _.get(App, 'a.b.c', 'default');
     *     // => '3
     *
     * @param {Object} parentObj
     * @param {string} path
     * @param {*} [defaultValue]
     * @return {*}
     */
    _.mixin({
        'get': function(parentObj, path, defaultValue) {
            var pathArr = path.split(".");
            var value;

            _.each(pathArr, function (pathProp, idx) {
                if (_.has(parentObj, pathProp)) {
                    var currVal = parentObj[pathProp];
                    var isLastPathProp = idx === pathArr.length - 1;

                    if (_.isObject(currVal)) {
                        if (isLastPathProp) {
                            value = currVal;
                            return false;
                        } else {
                            parentObj = currVal;
                        }
                    } else {
                        value = currVal;
                        return false;
                    }
                }
            });

            return _.isUndefined(value) ? defaultValue : value;
        }
    });
})();