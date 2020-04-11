const referralsService = {
    getReferrals: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const referrals = await prisma.referrals();

            if (!referrals) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'There are no transactions yet.',
                    data: []
                });
            }
            let allReferrals: any[] = referrals.map(
                async (referral: any): Promise<any> => {
                    const refs = await prisma.referral({ id: referral.id }).referrals();
                    return { ...referral, refs };
                }
            );

            allReferrals = await Promise.all(allReferrals);

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: allReferrals
            });
        } catch (err) {
            throw err;
        }
    }
};
export default referralsService;
