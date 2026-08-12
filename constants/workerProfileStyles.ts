import { StyleSheet } from 'react-native';

export const workerProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  profileHeaderContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#0F172A',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00B4D8',
    marginBottom: 12,
  },
  workerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  workerProfession: {
    fontSize: 14,
    color: '#00B4D8',
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  reviewsText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#00B4D8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  hireButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  cardBox: {
    backgroundColor: '#1E293B',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardText: {
    color: '#CBD5E1',
    lineHeight: 20,
  },
  reviewsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  writeReviewText: {
    color: '#00B4D8',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: '#1E293B',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 15,
  },
  reviewUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00B4D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  reviewUserName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  reviewDate: {
    color: '#94A3B8',
    fontSize: 11,
  },
  miniRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  miniRatingText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  reviewComment: {
    color: '#CBD5E1',
    fontSize: 13,
    marginBottom: 10,
  },
  reviewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
});