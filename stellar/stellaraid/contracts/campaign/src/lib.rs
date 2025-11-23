#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec};

// Campaign status enum
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CampaignStatus {
    Active,
    Completed,
    Cancelled,
}

// Milestone structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Milestone {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub percentage: u32, // Percentage of total funds to release
    pub is_completed: bool,
    pub votes_approve: u32,
    pub votes_reject: u32,
    pub proof_url: String,
}

// Campaign data structure
#[contracttype]
#[derive(Clone, Debug)]
pub struct Campaign {
    pub id: u64,
    pub creator: Address,
    pub title: String,
    pub organization: String,
    pub description: String,
    pub goal: i128,
    pub raised: i128,
    pub status: CampaignStatus,
    pub milestones: Vec<Milestone>,
    pub donor_count: u32,
    pub created_at: u64,
}

#[contract]
pub struct CampaignContract;

#[contractimpl]
impl CampaignContract {
    /// Create a new campaign
    pub fn create_campaign(
        env: Env,
        creator: Address,
        title: String,
        organization: String,
        description: String,
        goal: i128,
        milestones: Vec<Milestone>,
    ) -> u64 {
        // Authenticate creator
        creator.require_auth();

        // Generate campaign ID
        let campaign_id = env.ledger().sequence() as u64;

        // Validate milestones total to 100%
        let total_percentage: u32 = milestones.iter().map(|m| m.percentage).sum();
        assert!(total_percentage == 100, "Milestones must total 100%");

        // Create campaign
        let campaign = Campaign {
            id: campaign_id,
            creator: creator.clone(),
            title,
            organization,
            description,
            goal,
            raised: 0,
            status: CampaignStatus::Active,
            milestones,
            donor_count: 0,
            created_at: env.ledger().timestamp(),
        };

        // Store campaign
        env.storage().persistent().set(&campaign_id, &campaign);

        campaign_id
    }

    /// Get campaign information
    pub fn get_campaign(env: Env, campaign_id: u64) -> Campaign {
        env.storage()
            .persistent()
            .get(&campaign_id)
            .unwrap_or_else(|| panic!("Campaign not found"))
    }

    /// Record a donation (called by donation contract)
    pub fn record_donation(env: Env, campaign_id: u64, amount: i128) {
        let mut campaign: Campaign = Self::get_campaign(env.clone(), campaign_id);
        
        campaign.raised += amount;
        campaign.donor_count += 1;

        env.storage().persistent().set(&campaign_id, &campaign);
    }

    /// Update milestone with proof
    pub fn update_milestone(
        env: Env,
        campaign_id: u64,
        milestone_id: u32,
        proof_url: String,
    ) {
        let mut campaign: Campaign = Self::get_campaign(env.clone(), campaign_id);
        
        // Verify caller is campaign creator
        campaign.creator.require_auth();

        // Find and update milestone
        let mut milestones = campaign.milestones;
        for i in 0..milestones.len() {
            let mut milestone = milestones.get(i).unwrap();
            if milestone.id == milestone_id {
                milestone.proof_url = proof_url;
                milestones.set(i, milestone);
                break;
            }
        }

        campaign.milestones = milestones;
        env.storage().persistent().set(&campaign_id, &campaign);
    }

    /// Vote on milestone completion
    pub fn vote_milestone(
        env: Env,
        voter: Address,
        campaign_id: u64,
        milestone_id: u32,
        approve: bool,
    ) {
        voter.require_auth();

        let mut campaign: Campaign = Self::get_campaign(env.clone(), campaign_id);
        
        // Find and update milestone votes
        let mut milestones = campaign.milestones;
        for i in 0..milestones.len() {
            let mut milestone = milestones.get(i).unwrap();
            if milestone.id == milestone_id {
                if approve {
                    milestone.votes_approve += 1;
                } else {
                    milestone.votes_reject += 1;
                }
                
                // Auto-approve if votes_approve > votes_reject * 2
                if milestone.votes_approve > milestone.votes_reject * 2 {
                    milestone.is_completed = true;
                }
                
                milestones.set(i, milestone);
                break;
            }
        }

        campaign.milestones = milestones;
        env.storage().persistent().set(&campaign_id, &campaign);
    }

    /// Mark campaign as completed
    pub fn complete_campaign(env: Env, campaign_id: u64) {
        let mut campaign: Campaign = Self::get_campaign(env.clone(), campaign_id);
        
        campaign.creator.require_auth();
        
        campaign.status = CampaignStatus::Completed;
        env.storage().persistent().set(&campaign_id, &campaign);
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_create_campaign() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CampaignContract);
        let client = CampaignContractClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        
        let milestones = Vec::from_array(
            &env,
            [
                Milestone {
                    id: 1,
                    title: String::from_str(&env, "Phase 1"),
                    description: String::from_str(&env, "Initial setup"),
                    percentage: 50,
                    is_completed: false,
                    votes_approve: 0,
                    votes_reject: 0,
                    proof_url: String::from_str(&env, ""),
                },
                Milestone {
                    id: 2,
                    title: String::from_str(&env, "Phase 2"),
                    description: String::from_str(&env, "Final deployment"),
                    percentage: 50,
                    is_completed: false,
                    votes_approve: 0,
                    votes_reject: 0,
                    proof_url: String::from_str(&env, ""),
                },
            ],
        );

        let campaign_id = client.create_campaign(
            &creator,
            &String::from_str(&env, "Test Campaign"),
            &String::from_str(&env, "Test Org"),
            &String::from_str(&env, "Description"),
            &10000,
            &milestones,
        );

        let campaign = client.get_campaign(&campaign_id);
        assert_eq!(campaign.goal, 10000);
        assert_eq!(campaign.raised, 0);
    }
}
