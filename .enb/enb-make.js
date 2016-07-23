module.exports = function(config) {
    config.node("bundles/index", function(nodeConfig) {
        nodeConfig.addTechs([
            [ require("enb-bem-techs/techs/levels"), { levels: getLevels() } ],
            [ require("enb/techs/file-provider"), { target: "?.bemdecl.js" } ],
            [ require("enb-modules/techs/deps-with-modules"), { sourceSuffixes: ['js', 'jsx']} ],
            require("enb-bem-techs/techs/files"),
            require("./techs/jsx"),
            [ require("enb/techs/js"), { target: '?.browser.js' } ],
            [ require("enb/techs/js"), { target: '?.vanilla.js' } ],
            [ require('enb-bem-techs/techs/deps'), {
                target: '?.bemhtml.deps.js',
                bemdeclFile: '?.bemhtml.bemdecl.js'
            } ],
            [ require('enb-bem-techs/techs/files'), {
                depsFile: '?.bemhtml.deps.js',
                filesTarget: '?.bemhtml.files',
                dirsTarget: '?.bemhtml.dirs'
            } ],
            [ require("enb/techs/file-merge"), { sources: ['?.vanilla.js', '?.browser.js', '?.jsx.js'], target: '?.pre.js' } ],
            [ require("enb-modules/techs/prepend-modules"), { source: '?.pre.js', target: '?.js' } ],
            require("./techs/css-less")
        ]);

        nodeConfig.addTargets(["_?.js", "_?.css"]);

        function getLevels() {
            return [
                {"path":"libs/bem-core/common.blocks", "check":false},
                {"path":"blocks","check":true}
            ].map(function(l) { return config.resolvePath(l); });
        }
    });

    config.mode("development", function() {
       config.nodeMask(/bundles\/.*/, function(nodeConfig) {
           nodeConfig.addTechs([
               [ require("enb/techs/file-copy"), { sourceTarget: "?.js", destTarget: "_?.js" } ],
               [ require("enb/techs/file-copy"), { sourceTarget: "?.css", destTarget: "_?.css" } ]
           ]);
       });
    });

    config.mode("production", function() {
       config.nodeMask(/bundles\/.*/, function(nodeConfig) {
           nodeConfig.addTechs([
               [ require("enb-borschik/techs/borschik"), { sourceTarget: "?.js", destTarget: "_?.js", minify: true, freeze: false } ],
               [ require("enb-borschik/techs/borschik"), { sourceTarget: "?.css", destTarget: "_?.css", minify: true, freeze: false } ]
           ]);
       });
    });
}
