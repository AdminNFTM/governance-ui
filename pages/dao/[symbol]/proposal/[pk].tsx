import Link from 'next/link'
import ReactMarkdown from 'react-markdown/react-markdown.min'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import useProposal from '../../../../hooks/useProposal'
import StatusBadge from '../../../../components/StatusBadge'
import TokenBalanceCard from '../../../../components/TokenBalanceCard'
import DiscussionPanel from '../../../../components/DiscussionPanel'
import VotePanel from '../../../../components/VotePanel'
import { ProposalState } from '../../../../models/accounts'

import { calculatePct, fmtVoteCount } from '../../../../utils/formatting'
import ApprovalProgress from '../../../../components/ApprovalProgress'
import useRealm from '../../../../hooks/useRealm'

const Proposal = () => {
  const { symbol, mint } = useRealm()
  const { proposal, description, instructions } = useProposal()

  const yesVotePct = proposal
    ? calculatePct(proposal.info.yesVotesCount, mint?.supply)
    : null

  const yesVoteProgress =
    (yesVotePct / proposal?.info.voteThresholdPercentage?.value) * 100

  console.log('proposal data', { proposal, instructions })

  return (
    <div className="pb-10 pt-4">
      <Link href={`/dao/${symbol}/`}>
        <a className="flex items-center text-fgd-3">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          &nbsp; Back
        </a>
      </Link>
      <div className="pt-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 space-y-3">
            <div className="pb-4">
              <div className="pb-4">
                <h1 className="mb-1">{proposal?.info.name}</h1>
                <StatusBadge status={ProposalState[proposal?.info.state]} />
              </div>
              {description && <ReactMarkdown>{description}</ReactMarkdown>}
            </div>
            <DiscussionPanel />
            <VotePanel />
          </div>
          <div className="col-span-4 space-y-4">
            <TokenBalanceCard />
            <div className="bg-bkg-2 rounded-md">
              <div className="p-6">
                <h3 className="mb-4">Results</h3>
                <div className="flex space-x-4 items-center">
                  {proposal ? (
                    <>
                      <div className="bg-bkg-1 px-4 py-2 rounded w-full">
                        <p className="text-fgd-3 text-xs">Approve</p>
                        <div className="font-bold">
                          {fmtVoteCount(
                            proposal?.info.yesVotesCount,
                            mint?.decimals
                          ).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-bkg-1 px-4 py-2 rounded w-full">
                        <p className="text-fgd-3 text-xs">Deny</p>
                        <div className="font-bold">
                          {fmtVoteCount(
                            proposal?.info.noVotesCount,
                            mint?.decimals
                          ).toLocaleString()}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="animate-pulse bg-bkg-3 h-10 rounded w-full" />
                      <div className="animate-pulse bg-bkg-3 h-10 rounded w-full" />
                    </>
                  )}
                </div>
              </div>
              <ApprovalProgress progress={yesVoteProgress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Proposal