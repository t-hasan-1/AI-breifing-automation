const ArticlesDisplay = (props) => {

    const { articles } = props;
    return <>
        <div className="articles-section">
            {articles.length > 0 ? (
                articles.map((article, index) => (
                    <div key={index}>
                        <h3>{article.title}</h3>
                        <p>{article.content}</p>
                    </div>
                ))
            ) : (
                <p>No articles fetched yet.</p>
            )}
        </div>
    </>
}

export { ArticlesDisplay }