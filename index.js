const findTopComment = () => {
  // Get all the comments
  const issueComments = [
    ...document.querySelectorAll('.timeline-comment-group[id^="issuecomment"]'),
  ]
  const issueCommentsReactionsCounts = issueComments.map((issueComment) => {
    // Get all the reactions for a comment
    const issueCommentReactions = [
      ...issueComment.querySelectorAll(
        '.comment-reactions-options .js-discussion-reaction-group-count',
      ),
    ]
    // Add up all the reactions counts for a comment
    const issueCommentReactionsCount = issueCommentReactions.reduce(
      (acc, issueCommentReaction) =>
        acc + parseInt(issueCommentReaction.textContent, 10),
      0,
    )

    return { id: issueComment.id, reactionCount: issueCommentReactionsCount }
  })

  if (issueCommentsReactionsCounts.length > 0) {
    // Find the comment with the highest number of reactions
    return issueCommentsReactionsCounts.reduce((prev, current) =>
      prev.reactionCount > current.reactionCount ? prev : current,
    )
  }
}

const createTopCommentLink = (topCommentId) => {
  const topCommentContainer = document.createElement('div')
  topCommentContainer.className =
    'gh-header-actions mt-0 mt-md-2 mb-3 mb-md-0 ml-0 flex-md-order-1 flex-shrink-0 d-flex flex-items-start'

  const topCommentLink = document.createElement('a')
  topCommentLink.className = 'btn btn-sm btn-primary m-0 ml-2 ml-md-2'
  topCommentLink.textContent = 'Top Comment'
  topCommentLink.setAttribute('href', `#${topCommentId}`)
  topCommentContainer.appendChild(topCommentLink)

  const newIssueButton = document.querySelector('.gh-header-actions')

  if (newIssueButton) {
    newIssueButton.parentNode.insertBefore(topCommentContainer, newIssueButton)
  }
}

const run = () => {
  const topComment = findTopComment()

  if (topComment?.reactionCount > 0) createTopCommentLink(topComment.id)
}

run()

let lastUrl = location.href

const observer = new MutationObserver(() => {
  const url = location.href

  if (url !== lastUrl) {
    lastUrl = url

    run()
  }
}).observe(document.getElementById('repo-content-pjax-container'), {
  childList: true,
  subtree: true,
})
