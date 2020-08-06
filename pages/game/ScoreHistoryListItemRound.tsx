import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { sharedStyles } from '../../styles/shared'
import IconButton from '../../components/IconButton'
import { colors } from '../../styles/colors'

interface ScoreHistoryListItemRoundProps {
    round: number;
    score: number;
    updateRoundScore: (newScore: number) => void
    removeRound: () => void
}
const ScoreHistoryListItemRound = ({ score, round, updateRoundScore, removeRound }: ScoreHistoryListItemRoundProps) => {
    const [editingPoints, setEditingPoints] = useState(false);
    const [newScoreValue, setNewScoreValue] = useState<number | undefined>(score);

    const onSaveNewScore = () => {
        if ((!!newScoreValue || newScoreValue === 0) && newScoreValue !== score) {
            updateRoundScore(newScoreValue);
        }
        setEditingPoints(false);
    }
    return (
        <View style={sharedStyles.rowNoBorder} key={round + score}>
            <View style={sharedStyles.rowGroup}>
                <IconButton icon="trash-can-outline" color={colors.tertiary} clickHandler={removeRound} />
                <Text style={[sharedStyles.bodyText, sharedStyles.ml5]}>Round {round}</Text>
            </View>
            <View style={sharedStyles.rowGroup}>
                {
                    editingPoints ?
                        <IconButton icon="content-save-edit-outline" color={colors.primary} clickHandler={onSaveNewScore} /> :
                        <IconButton icon="pencil-outline" color={colors.primary} clickHandler={() => setEditingPoints(true)} />
                }
                {
                    editingPoints ?
                        <TextInput
                            style={[styles.scoreInput, sharedStyles.ml5]}
                            placeholder='Update Score'
                            onChangeText={(n) => setNewScoreValue(n ? parseInt(n.replace(/[^0-9]/g, ''), 10) : undefined)}
                            value={newScoreValue?.toString()}
                            autoCorrect={false}
                            keyboardType='number-pad'/>:
                        <Text style={[sharedStyles.bodyText, sharedStyles.ml5]}>{score} points</Text>

                }
            </View>
        </View>
    )
}

export default ScoreHistoryListItemRound

const styles = StyleSheet.create({
    scoreInput: {
        fontFamily: 'Quicksand',
        borderBottomColor: colors.greyMid,
        borderBottomWidth: 1,
        textAlign: 'center',
        minWidth: 50,
    },
})
