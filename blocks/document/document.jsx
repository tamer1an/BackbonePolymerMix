modules.require(['react', 'content','react-dom'], function(React, Content, ReactDOM){

    ReactDOM.render(
        <Content />,
        document.getElementById('content')
    );
});